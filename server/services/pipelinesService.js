// pipelinesService.js

const pipelinesRepository = require('../repositories/PipelinesRepository')
const usersRepository = require('../repositories/usersRepository');
const restructurePipelinesData = require('./func/restructurePipelinesData')
const { generateDocxBuffer } = require('./utils/docxReportGenerator');

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




// Другие методы сервиса

pipelinesService.getReportBuffer = async (pipelineId) => {
    const pipeline = await pipelinesRepository.findById(pipelineId);

    if (!pipeline) {
        throw new Error('Пиплайн не найден');
    }

    return await generateDocxBuffer(restructurePipelinesData(pipeline));
};

module.exports = pipelinesService;



function convertStringNumbersToNumbers(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            // Если строка пустая или состоит только из пробелов, заменить на null
            if (obj[key].trim() === '') {
                obj[key] = null;
            } else if (!isNaN(obj[key])) {
                // Преобразовать строку в число, если это возможно
                obj[key] = +obj[key];
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Рекурсивно обрабатывать вложенные объекты
            convertStringNumbersToNumbers(obj[key]);
        } else if (Array.isArray(obj[key])) {
            // Рекурсивно обрабатывать массивы
            obj[key].forEach((item, index) => {
                if (typeof item === 'string' && item.trim() === '') {
                    // Если элемент массива пустая строка, заменить на null
                    obj[key][index] = null;
                } else if (typeof item === 'string' && !isNaN(item)) {
                    // Преобразовать строку в число, если это возможно
                    obj[key][index] = +item;
                } else if (typeof item === 'object' && item !== null) {
                    // Обработка вложенных объектов внутри массива
                    convertStringNumbersToNumbers(item);
                }
            });
        }
    }
}




module.exports = pipelinesService