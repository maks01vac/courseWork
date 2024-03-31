// pipelinesService.js

const pipelinesRepository = require('../repositories/PipelinesRepository')
const usersRepository = require('../repositories/usersRepository');
const separatePointsByConnections = require('./func/separatePointsByConnections')

const pipelinesService = {}

pipelinesService.getUserPipelines = async (userId) => {
    if (!userId) {
        throw new Error('Не предоставлен ID пользователя');
    }
    // Проверяем, существует ли пользователь
    const userExists = await usersRepository.findById(userId);
    if (!userExists) {
        throw new Error('Пользователь не найден');
    }
    return await pipelinesRepository.findByUserId(userId);
};

pipelinesService.createPipeline = async (userId, pipelineData) => {

    convertStringNumbersToNumbers(pipelineData)
    // Здесь может быть дополнительная валидация pipelineData перед созданием записи
    // Проверяем, существует ли пользователь
    const userExists = await usersRepository.getById(userId);

    if (!userExists) {
        throw new Error('Пользователь не найден');
    }

    return await pipelinesRepository.createFullPipeline(userId, pipelineData);
};

pipelinesService.getPipeline = async (pipelineId) => {
    try {

        if (!pipelineId) {
            throw new Error('Не предоставлен ID пиплайна');
        }

        const resultGetPipeline = await pipelinesRepository.findById(pipelineId);

        resultGetPipeline.connections = resultGetPipeline.connections.map((connection) => {
            return{
                startId: connection.startnodeid,
                startName: searhNodeName(connection.startnodeid, resultGetPipeline.nodes),
                endId: connection.endnodeid,
                endName:searhNodeName(connection.endnodeid, resultGetPipeline.nodes),
                length:connection.length,
                diameter: connection.diameter,
                flow_rate:connection.flowrate
            }
        })

        resultGetPipeline.nodes = resultGetPipeline.nodes.map((node) => {
            return {
                group: 'nodes',
                data: {
                    id: node.nodeid,
                    name: node.nodename
                },
                position: {
                    x: node.positionx,
                    y: node.positiony
                },
                initPressure: node.pressure,
                pressure: node.pressure
            }
        })
        const singleOrMultiPointsInfo = separatePointsByConnections(resultGetPipeline.connections);

        const restructureResult = {
            generalData: {
                viscosity: resultGetPipeline.viscosity,
                density: resultGetPipeline.density,
                roughness: resultGetPipeline.roughness
            },
            linksInfo:resultGetPipeline.connections,
            multiConnectionNodes: singleOrMultiPointsInfo.multipleConnectionPoints,
            singleConnectionNodes: singleOrMultiPointsInfo.singleConnectionPoints,
            allNodes: resultGetPipeline.nodes
        }

        return restructureResult

    } catch (error) {
        console.log(error);
    }

};

pipelinesService.updatePipeline = async (pipelineId, pipelineData) => {
    // Здесь может быть дополнительная валидация pipelineData перед обновлением записи
    const pipeline = await pipelinesRepository.findById(pipelineId);
    if (!pipeline) {
        throw new Error('Пиплайн не найден');
    }
    return await pipelinesRepository.update(pipelineId, pipelineData);
};

pipelinesService.deletePipeline = async (pipelineId) => {
    const pipeline = await pipelinesRepository.findById(pipelineId);
    if (!pipeline) {
        throw new Error('Пиплайн не найден');
    }
    await pipelinesRepository.delete(pipelineId);
};

pipelinesService.getUserReports = async (userId) => {
    // Предполагаем, что есть функция в usersRepository для получения отчетов
    return await usersRepository.getReportsByUserId(userId);
};

function convertStringNumbersToNumbers(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string' && !isNaN(obj[key]) && obj[key].trim() !== '') {
            // Преобразовать строку в число, если это возможно
            obj[key] = +obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Рекурсивно обрабатывать вложенные объекты и массивы
            convertStringNumbersToNumbers(obj[key]);
        }
    }
}

function searhNodeName (id, nodes) {
    const node = nodes.find((node)=> node.nodeid == id)
    return node.nodename
}

module.exports = pipelinesService