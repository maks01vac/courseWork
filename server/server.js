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
    methods: ['GET', 'POST'], // Разрешить только эти методы
    allowedHeaders: ['Content-Type'], // Разрешить только эти заголовки
  }));

app.use(bodyParser.json());


// app.use('/', indexRouter);
app.use('/api', usersRouter);
app.use('/api', pipelinesRouter);
app.use('/api', pipelineCalcRouter);


// dataRoute.post('/process-data', async (req, res) => {
//   const graphData = req.body;
//   console.log(graphData)
//   if (graphData) {
//     // Запустите Python-скрипт с помощью модуля 'child_process'
//     const pythonProcess = spawn('./venv/Scripts/python.exe', ['python_scripts/calculationFlowAndPressure.py']);

//     // Отправьте данные в Python-скрипт через стандартный поток ввода
//     const jsonData = JSON.stringify(graphData)
//     // console.log(jsonData)
//     pythonProcess.stdin.write(jsonData);
//     pythonProcess.stdin.end();

//     let result = "";
    
//     // Получите данные от Python-скрипта через стандартный поток вывода
//     pythonProcess.stdout.on('data', (data) => {
//       result += data.toString();
//     });
//     pythonProcess.stderr.on('data', (data) => {
//       console.error(`Python stderr: ${data}`);
//     });

//     // Обработайте завершение Python-скрипта
//     pythonProcess.on('close', (code) => {
//       if (code !== 0) {
//         console.error(`Python process exited with code ${code}`);
//         res.status(500).json({ error: 'Ошибка выполнения Python-скрипта' });
//       } else {
//         try {
//           res.status(200).json(JSON.parse(result));
//           console.log(JSON.parse(result))
//           console.log('запрос прошел успешно');
//         } catch (err) {
//           console.error(`JSON parsing error: ${err}`);
//           res.status(500).json({ error: 'Ошибка разбора JSON' });
//         }
//       }
//     });
//   } else {
//     const error = {
//       error: 'Данные не пришли',
//     };
//     res.status(404).json(error);
//   }


// });


// app.use('', dataRoute);



app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});  
