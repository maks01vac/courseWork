import React, { useEffect, useState, useRef } from 'react';
import GraphDataForm from '../formPipeParam/GraphDataForm';
import PipeGraphModel from '../pipeGraphModel/PipeGraphModel';
import './style/Calc.css';
import RenderResult from '../renderResult/RenderResult';

const Calc = () => {

    const idPipe = useRef(1)

    const nodesAndLinkInfo = {
        idPipe:'',
        allNodes: [],
        singleConnectionNodes: [],
        multiConnectionNodes: [],
        linksInfo: []
    }

    const [results, setResults] = useState([])
    const [pipeModelInfo, setPipeModelInfo] = useState(nodesAndLinkInfo)
    const [sortedPipeModelInfo, setSortedPipeModelInfo] = useState(pipeModelInfo);

    const sortByName = (array) => {
        return array.sort((a, b) => a.name - b.name);
    };

    const sortByStartNameAndSwap = (array) => {
        return array
            .map((item) => {

                if (item.startName > item.endName) {
                    return {
                        ...item,
                        startId: item.endId,
                        startName: item.endName,
                        endId: item.startId,
                        endName: item.startName,
                    };
                }
                return item;
            })
            .sort((a, b) => a.startName - b.startName);
    };

    useEffect(() => {
        console.log('Изменения')
        const sortedNodesAndLinkInfo = {
            ...pipeModelInfo,
            singleConnectionNodes: sortByName(pipeModelInfo.singleConnectionNodes),
            linksInfo: sortByStartNameAndSwap(pipeModelInfo.linksInfo),
            multiConnectionNodes: sortByName(pipeModelInfo.multiConnectionNodes),
        };

        setSortedPipeModelInfo(sortedNodesAndLinkInfo);
    }, [pipeModelInfo]);



    return (
        <div className="Calc">
            <div className="formAndModel">
                <div className="pipeGraphForm">
                    <GraphDataForm idPipe={idPipe} graphData={sortedPipeModelInfo} results={results} setResults={setResults} />
                </div>

                <div className="graphModelBox">
                    <PipeGraphModel pipeModelInfo={pipeModelInfo} setPipeModelInfo={setPipeModelInfo} />
                </div>

            </div>
            <RenderResult idPipe={idPipe} results={results} setResults={setResults} />
        </div>

    );
};

export default Calc;