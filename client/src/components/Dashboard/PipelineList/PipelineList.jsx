import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../AuthContext/AuthContext';
import './style/PipelineList.css'
import { useGraphData } from '../../../GraphDataContext/GraphDataContext';
import { useNavigate } from 'react-router-dom';
import DownloadReportButton from '../../DownloadReportButton/DownloadReportButton';

const PipelineList = ({onEditPipeline, setErrors, setShowModal}) => {
  const { setPipeModelInfo, setResults, shouldBuildGraph } = useGraphData();
  const [pipelines, setPipelines] = useState([]);
  const { user,userId } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        // Замените :userId на фактический ID пользователя из контекста аутентификации
        const response = await axios.get(`http://localhost:3001/api/user/${userId}/pipelines`);
        setPipelines(response.data);
      } catch (error) {
        console.error('Ошибка при получении пайплайнов:', error);
      }
    };

    if (user) {
      fetchPipelines();
    }
  }, [user]);


  const handleEdit = async (pipelineId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pipelines/${pipelineId}`);
      setPipeModelInfo(response.data); // Установите состояние трубопровода
      setResults([response.data])
      shouldBuildGraph.current = true; // Установите флаг для построения графа
      navigate('/dashboard/new-pipeline'); // Перенаправьте пользователя на страницу создания
    } catch (error) {
      console.error('Ошибка при получении данных пайплайна:', error);
    }
  };

  const handleRemove = async (pipelineId) => {
    try {
      await axios.delete(`http://localhost:3001/api/pipelines/${pipelineId}`);
      // Обновить состояние пайплайнов после удаления
      setPipelines(pipelines.filter(pipeline => pipeline.pipelineid !== pipelineId));
    } catch (error) {
      console.error('Ошибка при удалении пайплайна:', error);
    }
  };


  return (
    <div className='pipelines-block'>
       {pipelines.length > 0 ? (
        pipelines.map(pipeline => (
          <div key={pipeline.idPipe} className="pipeline-block">
            <div className="pipeline-info">
              <h3>Сеть {pipeline.pipelineid}</h3>
            </div>
            <button onClick={() => handleEdit(pipeline.pipelineid)}>Вернуться к сети</button>
            <DownloadReportButton pipelineId={pipeline.pipelineid}/>
            <button onClick={() => handleRemove(pipeline.pipelineid)}>Удалить</button>
          </div>
        ))
      ) : (
        <p>У вас пока нет созданных сетей. Нажмите "Создать новую сеть", чтобы начать.</p>
      )}
    </div>
  );
};

export default PipelineList;