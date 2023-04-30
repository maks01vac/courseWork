const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // Разрешить запросы только с этого источника
    methods: ['GET', 'POST'], // Разрешить только эти методы
    allowedHeaders: ['Content-Type'], // Разрешить только эти заголовки
  }));

app.use(bodyParser.json());

let dataRoute = express.Router()


dataRoute.post('/process-data', async (req, res) => {
  const graphData = req.body;
  if (graphData) {
    // Запустите Python-скрипт с помощью модуля 'child_process'
    const pythonProcess = spawn('./venv/Scripts/python.exe', ['python_scripts/test_programm.py']);

    // Отправьте данные в Python-скрипт через стандартный поток ввода
    pythonProcess.stdin.write(JSON.stringify(graphData));
    pythonProcess.stdin.end();

    let result = '';
    // Получите данные от Python-скрипта через стандартный поток вывода
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    // Обработайте завершение Python-скрипта
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        res.status(500).json({ error: 'Ошибка выполнения Python-скрипта' });
      } else {
        try {
          res.status(200).json(JSON.parse(result));
          console.log('запрос прошел успешно');
        } catch (err) {
          console.error(`JSON parsing error: ${err}`);
          res.status(500).json({ error: 'Ошибка разбора JSON' });
        }
      }
    });
  } else {
    const error = {
      error: 'Данные не пришли',
    };
    res.status(404).json(error);
  }


});


app.use('', dataRoute);



app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});  




// Валидация данных
//   if (!graphData) {
//     res.status(400).send('Некорректные данные');
//     return;
//   }

//   // Запускаем Python-скрипт с передачей данных через аргументы
//   const pythonProcess = spawn('python', ['./python_script.py', JSON.stringify(graphData)]);

//   // Получаем результат из stdout
//   pythonProcess.stdout.on('data', (data) => {
//     const result = JSON.parse(data.toString());

//     // Отправляем результат обратно клиенту
//     res.status(200).json(result);
//   });

//   // Обрабатываем ошибки
//   pythonProcess.stderr.on('data', (error) => {
//     console.error(`Python error: ${error}`);
//     res.status(500).send('Ошибка сервера');
//   });

//   pythonProcess.on('error', (error) => {
//     console.error(`Ошибка запуска Python-скрипта: ${error}`);
//     res.status(500).send('Ошибка сервера');
//   });