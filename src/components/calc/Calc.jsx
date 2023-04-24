import React from 'react';
import FormPipeParam from '../formPipeParam/FormPipeParam';
import PipeGraphModel from '../pipeGraphModel/PipeGraphModel';
import './style/Calc.css';

const Calc = () => {
    return (
        <div className="Calc">
            <FormPipeParam />
            <div className="GraphModelBox">
                <PipeGraphModel />
            </div>
        </div>
    );
};

export default Calc;