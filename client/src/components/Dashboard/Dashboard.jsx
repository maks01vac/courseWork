import React from 'react';
import { useRef, useEffect} from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import PipelineList from './PipelineList/PipelineList';
import ReportList from './ReportList/ReportList';
import CreatePipeline from './CreatePipeline/CreatePipeline';
import './style/Dashboard.css';
import { useGraphData } from '../../GraphDataContext/GraphDataContext';
import { useLocation} from 'react-router-dom';
import PrivateOffice from './PrivateOffice/PrivateOffice';

const Dashboard = () => {
    const {setResults, resetPipeModelInfo } = useGraphData();

    const location = useLocation();
    const previousPath = useRef(location.pathname); // Реф для хранения предыдущего пути
  
    useEffect(() => {
      // Проверка условия перехода с '/dashboard/new-pipeline'
      if (previousPath.current == '/dashboard/new-pipeline' && location.pathname != '/dashboard/new-pipeline') {
        // Сброс состояния при переходе с '/dashboard/new-pipeline'
        resetPipeModelInfo();
        setResults([]);
      }
      // Обновление предыдущего пути
      previousPath.current = location.pathname;

    }, [location.pathname]);


    return (
        <div className="dashboard">
            <div className="cont">
                <Sidebar />
                <div className="dashboard-content">
                    <Routes>
                        <Route path="private-office" element={<PrivateOffice/>} />
                        <Route path="my-pipelines" element={<PipelineList />} />
                        <Route path="new-pipeline" element={<CreatePipeline />} />
                        {/* Другие маршруты, если они есть */}
                    </Routes>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;