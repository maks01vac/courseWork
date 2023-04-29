import React, { useEffect, useState } from 'react';
import GraphDataForm from '../formPipeParam/GraphDataForm';
import PipeGraphModel from '../pipeGraphModel/PipeGraphModel';
import './style/Calc.css';

const Calc = () => {
    const nodesAndLinkInfo = {
        allNodes:[],
        singleConnectionNodes:[],
        multiConnectionNodes:[],
        linksInfo:[]
      }

    const [pipeModelInfo,setPipeModelInfo] = useState(nodesAndLinkInfo)
    
    const changePipeData = (newPipeModelInfo) => {
        setPipeModelInfo(newPipeModelInfo);
      };

    //   useEffect(() => {
    //     console.log('GraphData изменен:', pipeModelInfo);
    //   }, [pipeModelInfo]);

    return (
        <div className="Calc">
            <GraphDataForm graphData={pipeModelInfo} />
            <div className="GraphModelBox">
                <PipeGraphModel pipeModelInfo={pipeModelInfo} setPipeModelInfo={setPipeModelInfo} />
            </div>
        </div>
    );
};

export default Calc;