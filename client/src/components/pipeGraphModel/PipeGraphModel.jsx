import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import './style/PipeGraphModel.css';
import cytoscapeHandle from './cytoscapeHandle/cytoscapeHandle';
import cytoscapeStyles from './style/cytoscapeStyles'
import cytoscapeContextMenu from './cytoscapeHandle/cytoscapeContextMenus'
import {useGraphData} from '../../GraphDataContext/GraphDataContext'
import transformPipeModelInfo from './utils/transformPipelineData';

const PipeGraphModel = ({selectedElementType, setValidateGraph, clearPipeline, setClearPipeline}) => {

  const { pipeModelInfo, setPipeModelInfo, shouldBuildGraph, resetPipeModelInfo } = useGraphData()
  const [prevPipeModelInfo, setPrevPipeModelInfo] = useState(pipeModelInfo);

  const nameNodeRef = useRef(1);
  const cyRef = useRef(null);

  const junctionNodeRef = useRef(1);
  const sourceNodeRef = useRef(1);
  const pumpNodeRef = useRef(1);
  const sinkNodeRef = useRef(1);
  const externalGridNodeRef = useRef(1);
  
  
  function getTypeRef (type) {
    switch(type) {
      case 'junction':
        return junctionNodeRef;
      case 'source':
        return sourceNodeRef;
      case 'pump':
        return pumpNodeRef;
      case 'sink':
        return sinkNodeRef;
      case 'external-grid':
        return externalGridNodeRef;
      default:
        return junctionNodeRef; // или другой default
    }
  }

  function isStructureChanged(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Проверяем количество ключей
    if (keys1.length !== keys2.length) {
        return true;
    }

    // Проверяем наличие и типы всех ключей
    for (const key of keys1) {
        if (typeof obj1[key] !== typeof obj2[key]) {
            return true;
        }

        // Рекурсивный вызов для объектов
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (isStructureChanged(obj1[key], obj2[key])) {
                return true;
            }
        }
    }

    return false;
}

    useEffect(() => {
      const transformedData = transformPipeModelInfo(pipeModelInfo);
        // Проверяем, изменилась ли структура pipeModelInfo
        if (isStructureChanged(prevPipeModelInfo, transformedData)) {
            // Обновляем предыдущее состояние
            setPrevPipeModelInfo(pipeModelInfo);
            setValidateGraph(false);
            setPipeModelInfo(transformedData);
        }
    }, [pipeModelInfo]);



  useEffect(() => {
    const junctionsNode = pipeModelInfo.allNodes.filter((node) => node.data.type === 'junction');
    if (junctionsNode.length === 0 && junctionNodeRef.current !== 1) {
      junctionNodeRef.current = 1;
    }
    const sourceNode = pipeModelInfo.allNodes.filter((node) => node.data.type === 'source');
    if (sourceNode.length === 0 && sourceNodeRef.current !== 1) {
      sourceNodeRef.current = 1;
    }  
    const pumpsNode = pipeModelInfo.allNodes.filter((node) => node.data.type === 'pump');
    if (pumpsNode.length === 0 && pumpNodeRef.current !== 1) {
      pumpNodeRef.current = 1;
    }  
    const sinksNode = pipeModelInfo.allNodes.filter((node) => node.data.type === 'sink');
    if (sinksNode.length === 0 && sinkNodeRef.current !== 1) {
      sinkNodeRef.current = 1;
    }  
    const externalGridsNode = pipeModelInfo.allNodes.filter((node) => node.data.type === 'external-grid');
    if (externalGridsNode.length === 0 && externalGridNodeRef.current !== 1) {
      externalGridNodeRef.current = 1;
    }
  }, [pipeModelInfo]);


  useEffect(() => {
    cytoscape.use(contextMenus);
    const cy = cytoscape({
      container: cyRef.current,
      elements: [],
      style: cytoscapeStyles,
      layout: {
        name: 'grid',
      },
      zoomingEnabled: false,
    });

    cy.on('tap', cytoscapeHandle.handleTap(cy, selectedElementType, setPipeModelInfo, getTypeRef))

    cy.on('dblclick', 'edge', cytoscapeHandle.handleDblTap(cy, setPipeModelInfo));

    const buildGraphFromData = (data) => {
      // Добавляем узлы
      const nodes = data.allNodes.map((node) => ({
        group: 'nodes',
        data: node.data,
        position: node.position,
      }));

      // Добавляем ребра
      const edges = data.linksInfo.map((link) => ({
        group: 'edges',
        data: { id: `${link.startId}-${link.endId}`, source: link.startId, target: link.endId },
      }));

      // Добавляем узлы и ребра в граф
      cy.add([...nodes, ...edges]);

      // Запускаем макет для отображения
      cy.layout({ name: 'preset' }).run();
    };


    // Построение графа только при включенном флаге
    if (shouldBuildGraph.current) {
      buildGraphFromData(pipeModelInfo); // Постройте граф на основе данных
      shouldBuildGraph.current = false; // Сбросьте флаг после построения графа
      setPrevPipeModelInfo(pipeModelInfo)
    }

    if(clearPipeline){
      resetPipeModelInfo()
      setValidateGraph(false)
      setClearPipeline(false)
    }

   

    cytoscapeContextMenu(cy, setPipeModelInfo, resetPipeModelInfo, setValidateGraph)
    return () => {
      cy.destroy();
    };

  }, [shouldBuildGraph, clearPipeline]);

  return <div className='cy' ref={cyRef} />;
};

export default PipeGraphModel;

