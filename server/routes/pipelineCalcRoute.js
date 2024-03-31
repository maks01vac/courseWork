var express = require('express');

const pipelineCalcController = require('../controllers/pipelineCalcController')

// const employeesController = require('../controllers/employeesController')

var pipelineCalcRouter = express.Router();

pipelineCalcRouter.post('/pipelineCalc', pipelineCalcController.calculation);

module.exports = pipelineCalcRouter;