// pipelinesService.js

const pipelinesRepository = require('../repositories/PipelinesRepository')
const usersRepository = require('../repositories/usersRepository');
const restructurePipelinesData = require('./func/restructurePipelinesData')

const pipelinesService = {}

pipelinesService.getUserPipelines = async (userId) => {
    if (!userId) {
        return{
            success: false,
            message: 'Не предоставлен ID пользователя'
        }
    }
    // Проверяем, существует ли пользователь
    const userExists = await usersRepository.getById(userId);
    if (!userExists) {
        return{
            success: false,
            message: 'Пользователь не найден'
        }
    }
    resultGetPipelinesByUser = await pipelinesRepository.findByUserId(userId)
    resultGetPipelinesByUser = resultGetPipelinesByUser.map((pipeline) => {return restructurePipelinesData(pipeline)})

    return resultGetPipelinesByUser;
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

        const data = await pipelinesRepository.findById(pipelineId);

        return restructurePipelinesData(data)

    } catch (error) {
        console.log(error);
    }

};

pipelinesService.updatePipeline = async (pipelineId, pipelineData) => {
    // Здесь может быть дополнительная валидация pipelineData перед обновлением записи
    const oldPipelineDelete = await pipelinesRepository.deleteById(pipelineId);

    if(!oldPipelineDelete){
        return oldPipelineDelete
    }
    await pipelinesRepository.createFullPipeline(pipelineData.userId, pipelineData);
};

pipelinesService.deletePipeline = async (pipelineId) => {
    const pipeline = await pipelinesRepository.findById(pipelineId);
    if (!pipeline) {
        throw new Error('Пиплайн не найден');
    }
    await pipelinesRepository.deleteById(pipelineId);
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




module.exports = pipelinesService