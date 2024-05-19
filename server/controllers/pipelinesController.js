// pipelinesController.js
const { validationResult } = require('express-validator');
const pipelinesService = require('../services/pipelinesService');




const pipelinesController = {}

pipelinesController.getUserPipelines = async (req, res) => {
    const userId = req.params.userId;
    try {
        const pipelines = await pipelinesService.getUserPipelines(userId);
        res.json(pipelines);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Ошибка при получении сетей пользователя', error: error });
    }
};

pipelinesController.createPipeline = [
    // Валидация данных здесь, если требуется
    async (req, res) => {
        // Проверка на ошибки валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const userId = req.params.userId;
            const pipelineData = req.body; // данные сети из запроса
            const newPipeline = await pipelinesService.createPipeline(userId, pipelineData);
            res.status(201).json(newPipeline);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при создании новой сети' });
        }
    }
];

pipelinesController.getPipeline = async (req, res) => {
    const pipelineId = req.params.pipelineId;
    try {
        const pipeline = await pipelinesService.getPipeline(pipelineId);
        if (!pipeline) {
            return res.status(404).json({ message: 'Сеть не найдена' });
        }
        res.json(pipeline);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении данных сети' });
    }
};

pipelinesController.updatePipeline = [
    // Валидация данных здесь, если требуется
    async (req, res) => {
        // Проверка на ошибки валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const pipelineId = req.params.pipelineId;
            const pipelineData = req.body; // обновленные данные сети из запроса
            const updatedPipeline = await pipelinesService.updatePipeline(pipelineId, pipelineData);
            res.json(updatedPipeline);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении сети' });
        }
    }
];

pipelinesController.deletePipeline = async (req, res) => {
    const pipelineId = req.params.pipelineId;
    try {
        await pipelinesService.deletePipeline(pipelineId);
        res.status(200).json({ message: 'Сеть успешно удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении сети' });
    }
};


pipelinesController.createReport = async (req, res) => {
    const pipelineId = req.params.pipelineId;
    try {
        // Получаем буфер для отчета из сервисного слоя
        const buffer = await pipelinesService.getReportBuffer(pipelineId);

        // Возвращаем буфер клиенту
        res.writeHead(200, {
            'Content-Disposition': 'attachment; filename="report.docx"',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        res.end(buffer);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании отчета', error });
    }
};


module.exports = pipelinesController