import React, { useState, useRef, useEffect, Component } from 'react';
import PipeGraphModel from '../../PipeGraphModel/PipeGraphModel';
import GraphDataForm from '../../Form/GraphDataForm/GraphDataForm';
import RenderResult from '../../RenderResult/RenderResult';
import validateNetworkData from '../../Form/GraphDataForm/validator/validatorPipelineData'
import junctionIcon from '../Icons/junction_icon.png';
import pumpIcon from '../Icons/pump_icon.png';
import sinkIcon from '../Icons/sink_icon.png';
import sourceIcon from '../Icons/source_icon.png';
import externalGridIcon from '../Icons/external_grid_icon.png';
import junctionIconActive from '../Icons/junction_icon_active.png';
import pumpIconActive from '../Icons/pump_icon_active.png';
import sinkIconActive from '../Icons/sink_icon_active.png';
import sourceIconActive from '../Icons/source_icon_active.png';
import externalGridIconActive from '../Icons/external_grid_icon_active.png';
import Modal from '../../Modal/Modal'
import { useGraphData } from '../../../GraphDataContext/GraphDataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../../../AuthContext/AuthContext'
import downloadReport from '../../DownloadReportButton/utils/downloadReport';



const CreatePipeline = () => {
    const { pipeModelInfo, results, setResults} = useGraphData();
    const [errors, setErrors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [activeElement, setActiveElement] = useState('junction');
    const [clearPipeline, setClearPipeline] = useState(false)
    const navigate = useNavigate()
    const { userId } = useAuth();

    useEffect(()=>{console.log(pipeModelInfo)},[pipeModelInfo])

    const elements = [
        { id: 'junction', name: 'узел', icon: junctionIcon, activeIcon:junctionIconActive },
        { id: 'pump', name: 'Насос', icon: pumpIcon, activeIcon:pumpIconActive },
        { id: 'sink', name: 'Сток', icon: sinkIcon, activeIcon:sinkIconActive },
        { id: 'source', name: 'Источник', icon: sourceIcon, activeIcon:sourceIconActive },
        { id: 'external-grid', name: 'Внешняя сеть', icon: externalGridIcon, activeIcon:externalGridIconActive }
    ];

    const selectedElementType = useRef({ name_rus: "узел", name_pp: "junction" });

    const [validateGraph, setValidateGraph] = useState(false)



    function validGraph() {
        const validationResult = validateNetworkData.validatePipelineComponents(pipeModelInfo)
        if (validationResult.length > 0) {
            setErrors(validationResult); // Сохраняем ошибки
            setShowModal(true); // Открываем модальное окно
        } else {
            setValidateGraph(true)
        }
    }


    const closeModal = () => {
        setShowModal(false);
    }
    const savePipelineInDd = async (data) =>{
        try{
            const response = await axios.post(`http://localhost:3001/api/user/${userId}/pipelines`, data);
            if(response.data.success){
                navigate('/dashboard/my-pipelines')
                setResults([])
                return response.data.pipelineId
            }else{
                setErrors('Ошибка сохранения',response.data)
                setShowModal(true)
            }
        }catch(e){
           
        }
        

   }

    return (
        <div className="create-pipeline-block">
            <div className="element-selector">
                {elements.map((elem) => (
                    <button
                        key={elem.id}
                        className={`icon-button ${activeElement === elem.id ? 'active' : ''}`}
                        onClick={() => {setActiveElement(elem.id) 
                            selectedElementType.current = {name_rus:elem.name, name_pp:elem.id}
                        }}
                    >
                        <img src={activeElement === elem.id ? elem.activeIcon : elem.icon}/>
                        <div className="tooltip">{elem.name}</div>
                    </button>
                ))}
            </div>
            <h3>Топология трубопроводной сети</h3>
            <div className='pipeline-graph-block'>
                <PipeGraphModel selectedElementType={selectedElementType} setValidateGraph={setValidateGraph} clearPipeline={clearPipeline} setClearPipeline ={setClearPipeline}/>
            </div>
            <Modal isOpen={showModal} onClose={closeModal}>
                <div className="error-modal-content">
                    <h4>Ошибки валидации</h4>
                    <ul>
                        {errors.map((error, index) => <li key={index}>{error}</li>)}
                    </ul>
                    <button onClick={closeModal}>OK</button>
                </div>
            </Modal>
            {!(validateGraph || results.length !== 0 || clearPipeline) ? (<button onClick={validGraph}>Ввести данные</button>) : (
                <>
                    <h3>Данные для сети</h3>
                    <div className='data-form'>
                        <GraphDataForm />
                    </div>
                    <RenderResult/>
                </>)}
                {results.length>0 ? (
                    <div className='result-button'>
                        <button onClick={() => setResults([])}>Изменить данные</button>
                        <button onClick={() => savePipelineInDd(results[0])}>Сохранить сеть</button>
                        <button onClick={async () => {
                            const newPipelineId = await savePipelineInDd(results[0])
                            downloadReport(newPipelineId)}}>Сохранить и создать отчет</button>
                        <button onClick={() => {
                            setClearPipeline(true)
                            setResults([]) }}>Удалить сеть</button>
                    </div>
                ) : (<></>)}
                
        </div>
    );
};

export default CreatePipeline;