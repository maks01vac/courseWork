const pipelinesRepository = {};
const dbPool = require('../db_pool/db_pool')


pipelinesRepository.createFullPipeline = async function (userid, pipelineData) {
    const client = await dbPool.connect();
    const {generalData, linksInfo, allNodes} = pipelineData

    try {
      await client.query('BEGIN'); // начало транзакции
  
      // Вставка в таблицу Pipelines
      const pipelineQuery = `
        INSERT INTO Pipelines (userid, viscosity, density, roughness)
        VALUES ($1, $2, $3, $4) RETURNING *`;
      const pipelineValues = [userid, generalData.viscosity, 
        generalData.density, generalData.roughness];
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
    console.log(pipelineId)
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

  module.exports = pipelinesRepository