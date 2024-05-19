const pipelineCalcController = {};

const { spawn } = require('child_process');


pipelineCalcController.calculation = async (req, res) => {
    const graphData = req.body;
    if (graphData) {
      // Запустите Python-скрипт с помощью модуля 'child_process'
      const pythonProcess = spawn('./venv/Scripts/python.exe', ['./python_scripts/calculationPipeline.py']);
  
      // Отправьте данные в Python-скрипт через стандартный поток ввода
      const jsonData = JSON.stringify(graphData)
      // console.log(jsonData)
      pythonProcess.stdin.write(jsonData);
      pythonProcess.stdin.end();
      let result = "";
      
      // Получите данные от Python-скрипта через стандартный поток вывода
      pythonProcess.stdout.on('data', (data) => {
        result = data.toString();
      });
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
      });
  
      // Обработайте завершение Python-скрипта
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          res.status(500).json({ error: 'Ошибка выполнения Python-скрипта'
           });
        } else {
          try {
            console.log(result)
            res.status(200).json(JSON.parse(result));
            console.log(JSON.parse(result))
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
  
  
  };

  module.exports = pipelineCalcController