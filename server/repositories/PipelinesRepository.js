const pipelinesRepository = {};
const dbPool = require('../db_pool/db_pool')


pipelinesRepository.findByUserId = async function (userId) {
  try {
    const client = await dbPool.connect();
    
    // Выполняем запрос к базе данных для получения всех пиплайнов, принадлежащих пользователю
    const query = 'SELECT pipelineid FROM Pipelines WHERE UserID = $1';
    const { rows } = await client.query(query, [userId]);
    client.release(); // освобождение клиента в пуле
    const result = []
    

    for (const id of rows) {
      const pipeline = await this.findById(id.pipelineid)
      result.push(pipeline)
    }
    return result; // Возвращаем результат запроса, массив пиплайнов
  } catch (error) {
    console.error('', error);
    return{
      success: false,
      message: 'Ошибка при получении пиплайнов пользователя:',
      error:error
    }
  }finally {
    
  }
}


pipelinesRepository.createFullPipeline = async function (userid, pipelineData) {
  const client = await dbPool.connect();
  const { generalData, linksInfo, allNodes } = pipelineData

  try {
    await client.query('BEGIN'); // начало транзакции

    // Вставка в таблицу Pipelines

    let pipelineQuery = `
        INSERT INTO Pipelines (userid, viscosity, density, roughness)
        VALUES ($1, $2, $3, $4) RETURNING *`;
    let pipelineValues = [userid, generalData.viscosity,
      generalData.density, generalData.roughness];

    if (pipelineData.idPipe) {
      pipelineQuery = `
        INSERT INTO Pipelines (pipelineid,userid, viscosity, density, roughness)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        pipelineValues = [pipelineData.idPipe, userid, generalData.viscosity,
          generalData.density, generalData.roughness];
    }
    const pipelineResult = await client.query(pipelineQuery, pipelineValues);
    const pipeline = pipelineResult.rows[0];

    // Вставка узлов в таблицу Nodes
    for (const node of pipelineData.allNodes) {

      const nodeQuery = `
          INSERT INTO Nodes (nodeid, pipelineid, nodename, pressure, positionx, positiony)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const nodeValues = [node.data.id, pipeline.pipelineid, node.data.name, node.pressure, node.position.x, node.position.y];
      const node1 = await client.query(nodeQuery, nodeValues);
    }

    // Вставка соединений в таблицу Connections
    for (const connection of linksInfo) {
      const connectionQuery = `
          INSERT INTO Connections (pipelineid, startnodeid, endnodeid, length, diameter, flowrate)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const connectionValues = [pipeline.pipelineid, connection.startId, connection.endId, connection.length, connection.diameter, connection.flow_rate];
      await client.query(connectionQuery, connectionValues);
    }

    await client.query('COMMIT'); // завершение транзакции
    return pipeline; // возвращаем созданный трубопровод с узлами и соединениями
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
    const pipelineQuery = 'SELECT * FROM Pipelines WHERE PipelineID = $1';
    const pipelineResult = await client.query(pipelineQuery, [pipelineId]);
    const pipeline = pipelineResult.rows[0];

    if (!pipeline) {
      return null; // Если пиплайн не найден, возвращаем null
    }

    // Получаем узлы, связанные с сетью
    const nodesQuery = 'SELECT * FROM Nodes WHERE PipelineID = $1';
    const nodesResult = await client.query(nodesQuery, [pipelineId]);
    const nodes = nodesResult.rows;

    // Получаем соединения, связанные с сетью
    const connectionsQuery = 'SELECT * FROM Connections WHERE PipelineID = $1';
    const connectionsResult = await client.query(connectionsQuery, [pipelineId]);
    const connections = connectionsResult.rows;
    return {
      ...pipeline,
      nodes,
      connections
    };
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
    await client.query('BEGIN'); // начало транзакции

    // Удаление соединений
    await client.query('DELETE FROM Connections WHERE PipelineID = $1', [pipelineId]);

    // Удаление узлов
    await client.query('DELETE FROM Nodes WHERE PipelineID = $1', [pipelineId]);

    // Удаление самой сети
    await client.query('DELETE FROM Pipelines WHERE PipelineID = $1', [pipelineId]);


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

module.exports = pipelinesRepository