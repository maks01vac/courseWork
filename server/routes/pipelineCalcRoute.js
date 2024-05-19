var express = require('express');

const pipelineCalcController = require('../controllers/pipelineCalcController')


var pipelineCalcRouter = express.Router();

pipelineCalcRouter.post('/pipelineCalc', pipelineCalcController.calculation);

module.exports = pipelineCalcRouter;