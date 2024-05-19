const pipelinesRepository = {};
const dbPool = require('../db_pool/db_pool')


pipelinesRepository.findByUserId = async function (userId) {

  const client = await dbPool.connect();

  try {
    // Выполняем запрос к базе данных для получения всех пиплайнов, принадлежащих пользователю
    const query = 'SELECT pipelineid FROM Pipelines WHERE UserID = $1';
    const { rows } = await client.query(query, [userId]);
    const result = rows

    return result; // Возвращаем результат запроса, массив пиплайнов
  } catch (error) {
    console.error('', error);
    return {
      success: false,
      message: 'Ошибка при получении сетей пользователя:',
      error: error
    }
  } finally {
    client.release();
  }
}


pipelinesRepository.createFullPipeline = async function (userId, pipelineData) {
  const { generalData, allNodes, linksInfo, components } = pipelineData;
  const client = await dbPool.connect();
  try {
    // Начало транзакции
    await client.query('BEGIN');

    // Вставка данных в таблицу Pipelines
    const pipelineResult = await client.query(
      'INSERT INTO Pipelines (UserID, Roughness, FluidNameRus, FluidNamePP) VALUES ($1, $2, $3, $4) RETURNING PipelineID',
      [userId, generalData.roughness, generalData.fluid.name_rus, generalData.fluid.name_pp]
    );
    const pipelineId = pipelineResult.rows[0].pipelineid;

    // Вставка всех узлов в таблицу Nodes
    const nodeMap = {}; // Map для сопоставления ID узлов
    for (const node of allNodes) {
      const result = await client.query(
        'INSERT INTO Nodes (PipelineID, NodeName, NodeType, PositionX, PositionY) VALUES ($1, $2, $3, $4, $5) RETURNING NodeID',
        [pipelineId, node.data.name, node.data.type, node.position.x, node.position.y]
      );
      nodeMap[node.data.id] = result.rows[0].nodeid;
    }

    // Вставка всех связей в таблицу Links
    for (const link of linksInfo) {
      await client.query(
        'INSERT INTO Links (PipelineID, StartNodeID, EndNodeID) VALUES ($1, $2, $3)',
        [pipelineId, nodeMap[link.startId], nodeMap[link.endId]]
      );
    }

    for (const pipe of components.pipes) {
      await client.query(
        `INSERT INTO Pipes 
            (PipelineID, StartNodeID, EndNodeID, Diameter, Length, LossCoefficient, AlphaWPerM2K, QExtW, ResultID, VelocityMean, PressureFrom, PressureTo, TemperatureFrom, TemperatureTo, MassFlowFrom, MassFlowTo, VolumeFlowNorm, ReynoldsNumber, FrictionFactor) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          pipelineId,
          nodeMap[pipe.startId],
          nodeMap[pipe.endId],
          pipe.diameter,
          pipe.length,
          pipe.loss_coefficient,
          pipe.alpha_w_per_m2k,
          pipe.qext_w,
          pipe.result_id,
          pipe.results.velocity_mean,
          pipe.results.pressure_from,
          pipe.results.pressure_to,
          pipe.results.temperature_from,
          pipe.results.temperature_to,
          pipe.results.mass_flow_from,
          pipe.results.mass_flow_to,
          pipe.results.volume_flow_norm,
          pipe.results.reynolds_number,
          pipe.results.friction_factor
        ]
      );
    }

    // Вставка данных в компоненты (насосы, источники и т. д.)
    for (const junction of components.junctions) {
      await client.query(
        'INSERT INTO junctionResults (NodeID, Pressure, Temperature, InitPressure) VALUES ($1, $2, $3, $4)',
        [nodeMap[junction.id], junction.results.p_bar, junction.results.t_k, junction.init_pressure]
      );
    }

    for (const pump of components.pumps) {
      await client.query(
        'INSERT INTO PumpResults (NodeID, StartJunction, EndJunction, PressureLift) VALUES ($1, $2, $3, $4)',
        [nodeMap[pump.id], nodeMap[pump.start_junction], nodeMap[pump.end_junction], pump.results.pressure_lift]
      );
    }

    for (const source of components.sources) {
      await client.query(
        'INSERT INTO Sources (NodeID, PipelineID, MassFlow, Scaling, ToJunction) VALUES ($1, $2, $3, $4, $5)',
        [nodeMap[source.id], pipelineId, parseFloat(source.mdot_kg_per_s), source.scaling, nodeMap[source.to_junction[0]]]
      );
    }

    for (const sink of components.sinks) {
      await client.query(
        'INSERT INTO Sinks (NodeID, PipelineID, MassFlow, Scaling, ToJunction) VALUES ($1, $2, $3, $4, $5)',
        [nodeMap[sink.id], pipelineId, parseFloat(sink.mdot_kg_per_s), sink.scaling, nodeMap[sink.to_junction[0]]]
      );
    }

    for (const grid of components.ext_grids) {
      await client.query(
        'INSERT INTO ExternalGridResults (NodeID, PipelineID, Pressure, MassFlow, ToJunction) VALUES ($1, $2, $3, $4, $5)',
        [nodeMap[grid.id], pipelineId, parseFloat(grid.pressure), grid.results.mdot_kg_per_s, nodeMap[grid.to_junction[0]]]
      );
    }

    // Коммит транзакции
    await client.query('COMMIT');

    return {
      success: true,
      pipelineId: pipelineId
    }
  } catch (error) {
    await client.query('ROLLBACK'); // откат транзакции в случае ошибки
    console.log(error);
    throw error;

  } finally {
    client.release(); // освобождение клиента в пуле
  }
}



pipelinesRepository.findById = async function (pipelineId) {
  const client = await dbPool.connect();
  try {
    // Получаем данные о сети
    const pipelineResult = await client.query('SELECT * FROM Pipelines WHERE PipelineID = $1', [pipelineId]);
    if (pipelineResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }
    const pipeline = pipelineResult.rows[0];

    // Получаем все узлы
    const nodesResult = await client.query('SELECT * FROM Nodes WHERE PipelineID = $1', [pipelineId]);
    const nodes = nodesResult.rows;

    // Получаем все связи
    const linksResult = await client.query('SELECT * FROM Links WHERE PipelineID = $1', [pipelineId]);
    const links = linksResult.rows;

    // Получаем результаты узлов
    const junctionsResult = await client.query(`
          SELECT * FROM JunctionResults 
          WHERE NodeID IN (SELECT NodeID FROM Nodes WHERE PipelineID = $1)
      `, [pipelineId]);
    const junctions = junctionsResult.rows;

    // Получаем результаты насосов
    const pumpsResult = await client.query(`
          SELECT * FROM PumpResults 
          WHERE NodeID IN (SELECT NodeID FROM Nodes WHERE PipelineID = $1)
      `, [pipelineId]);
    const pumps = pumpsResult.rows;

    // Получаем источники
    const sourcesResult = await client.query('SELECT * FROM Sources WHERE PipelineID = $1', [pipelineId]);
    const sources = sourcesResult.rows;

    // Получаем стоки
    const sinksResult = await client.query('SELECT * FROM Sinks WHERE PipelineID = $1', [pipelineId]);
    const sinks = sinksResult.rows;

    // Получаем внешние сети
    const externalGridsResult = await client.query('SELECT * FROM ExternalGridResults WHERE PipelineID = $1', [pipelineId]);
    const externalGrids = externalGridsResult.rows;

    // Получаем данные по трубам
    const pipesResult = await client.query(`
          SELECT * FROM Pipes 
          WHERE PipelineID = $1
      `, [pipelineId]);
    const pipes = pipesResult.rows;

    // Формируем окончательный ответ
    const response = {
      pipeline,
      nodes,
      links,
      junctions,
      pumps,
      sources,
      sinks,
      externalGrids,
      pipes
    };
    return response
  } catch (error) {
    console.log(error);
    throw error;

  } finally {
    client.release(); // освобождение клиента в пуле
  }
}

pipelinesRepository.deleteById = async function (pipelineId) {
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');

    // Удаляем результаты узлов
    await client.query(`
            DELETE FROM JunctionResults
            WHERE NodeID IN (SELECT NodeID FROM Nodes WHERE PipelineID = $1)
        `, [pipelineId]);

    // Удаляем результаты насосов
    await client.query(`
            DELETE FROM PumpResults
            WHERE NodeID IN (SELECT NodeID FROM Nodes WHERE PipelineID = $1)
        `, [pipelineId]);

    // Удаляем источники
    await client.query('DELETE FROM Sources WHERE PipelineID = $1', [pipelineId]);

    // Удаляем стоки
    await client.query('DELETE FROM Sinks WHERE PipelineID = $1', [pipelineId]);

    // Удаляем внешние сети
    await client.query('DELETE FROM ExternalGridResults WHERE PipelineID = $1', [pipelineId]);

    // Удаляем трубы
    await client.query('DELETE FROM Pipes WHERE PipelineID = $1', [pipelineId]);

    // Удаляем связи
    await client.query('DELETE FROM Links WHERE PipelineID = $1', [pipelineId]);

    // Удаляем узлы
    await client.query('DELETE FROM Nodes WHERE PipelineID = $1', [pipelineId]);

    // Удаляем саму сеть (трубопровод)
    await client.query('DELETE FROM Pipelines WHERE PipelineID = $1', [pipelineId]);

    // Завершаем транзакцию
    await client.query('COMMIT');
    return {
      success: true
    };

  } catch (error) {
    await client.query('ROLLBACK'); // откат транзакции в случае ошибки
    console.log(error);
    return {
      success: false,
      message: "Не удалось удалить сеть"
    }

  } finally {
    client.release(); // освобождение клиента в пуле
  }
}

pipelinesRepository.deleteAllPipelinesByUserId = async function (userId) {


  try {
    // Начинаем транзакцию
    await client.query('BEGIN');

    // Получаем все PipelineID, связанные с этим пользователем
    const pipelineResults = await client.query('SELECT PipelineID FROM Pipelines WHERE UserID = $1', [userId]);
    const pipelineIds = pipelineResults.rows.map(row => row.pipelineid);

    if (pipelineIds.length === 0) {
      // Нет сетей, связанных с этим пользователем
      return res.status(404).json({ message: 'No networks found for this user' });
    }

    // Удаляем результаты узлов
    await client.query(`
        DELETE FROM JunctionResults
        WHERE NodeID IN (SELECT NodeID FROM Nodes WHERE PipelineID = ANY($1::int[]))
    `, [pipelineIds]);

    // Удаляем результаты насосов
    await client.query(`
        DELETE FROM PumpResults
        WHERE NodeID IN (SELECT NodeID FROM Nodes WHERE PipelineID = ANY($1::int[]))
    `, [pipelineIds]);

    // Удаляем источники
    await client.query('DELETE FROM Sources WHERE PipelineID = ANY($1::int[])', [pipelineIds]);

    // Удаляем стоки
    await client.query('DELETE FROM Sinks WHERE PipelineID = ANY($1::int[])', [pipelineIds]);

    // Удаляем внешние сети
    await client.query('DELETE FROM ExternalGridResults WHERE PipelineID = ANY($1::int[])', [pipelineIds]);

    // Удаляем трубы
    await client.query('DELETE FROM Pipes WHERE PipelineID = ANY($1::int[])', [pipelineIds]);

    // Удаляем связи
    await client.query('DELETE FROM Links WHERE PipelineID = ANY($1::int[])', [pipelineIds]);

    // Удаляем узлы
    await client.query('DELETE FROM Nodes WHERE PipelineID = ANY($1::int[])', [pipelineIds]);

    // Удаляем сами сети
    await client.query('DELETE FROM Pipelines WHERE PipelineID = ANY($1::int[])', [pipelineIds]);

    // Завершаем транзакцию
    await client.query('COMMIT');
    return {
      success: true
    }
  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await client.query('ROLLBACK');
    return {
      success: false,
      message: "Не удалось удалить сети"
    }
  } finally {
    client.release();
  }
}



module.exports = pipelinesRepository