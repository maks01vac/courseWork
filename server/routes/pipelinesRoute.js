// pipelinesRouter.js

const express = require('express');
const pipelinesRouter = express.Router();
const pipelinesController = require('../controllers/pipelinesController');

// Получить все сети пользователя
pipelinesRouter.get('/user/:userId/pipelines', pipelinesController.getUserPipelines);

// Создать новую сеть
pipelinesRouter.post('/user/:userId/pipelines', pipelinesController.createPipeline);

// Получить данные сети для редактирования
pipelinesRouter.get('/pipelines/:pipelineId', pipelinesController.getPipeline);

// Обновить сеть
pipelinesRouter.put('/pipelines/:pipelineId', pipelinesController.updatePipeline);

// Удалить сеть
pipelinesRouter.delete('/pipelines/:pipelineId', pipelinesController.deletePipeline);

// Получить отчеты пользователя
pipelinesRouter.post('/pipelines/:pipelineId/report', pipelinesController.createReport);


module.exports = pipelinesRouter;