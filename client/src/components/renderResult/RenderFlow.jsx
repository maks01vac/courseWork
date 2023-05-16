import React from 'react';

const RenderFlow = ({linksInfo}) => {
    return (
        <div className="renderResult">
        {linksInfo.map((link, index) => (
            <div key={index} className='resultElement'>
                <h5>Труба {link.startName} - {link.endName}</h5>
                <ul>
                    <li>Поток:<b>{link.flow_rate}</b> м/с </li>
                </ul>
            </div>
        ))}
    </div>
    );
};

export default RenderFlow;