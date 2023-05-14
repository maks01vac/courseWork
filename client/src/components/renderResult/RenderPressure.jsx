import React from 'react';

const RenderPressure = ({multiConnectionNodes}) => {
    return (
        <div className="renderResult">
        {multiConnectionNodes.map((node, index) => (
            <div key={index} className='resultElement'>
                <h5>Узел {node.name}</h5>
                <ul>
                    <li>Давление: <b>{node.pressure}</b> бар</li>
                </ul>
            </div>
        ))}
    </div>
    );
};

export default RenderPressure;