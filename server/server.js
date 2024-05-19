const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const app = express();
const port = 3001;
const cors = require('cors');

const pipelineCalcRouter = require('./routes/pipelineCalcRoute');
const usersRouter = require('./routes/usersRoute');
const pipelinesRouter = require('./routes/pipelinesRoute');

app.use(cors({
    origin: 'http://localhost:3000', // Разрешить запросы только с этого источника
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], // Разрешить только эти методы
    allowedHeaders: ['Content-Type'], // Разрешить только эти заголовки
  }));

app.use(bodyParser.json());


// app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/api', pipelinesRouter);
app.use('/api', pipelineCalcRouter);



app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});  
