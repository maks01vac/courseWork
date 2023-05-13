import React, { useEffect } from 'react';
import './styles/RenderResult.css'

const RenderResult = ({linksInfo, multiConnectionNodes }) => {

    const areSpecificFieldsNotEmpty = (array, fieldsToCheck) => {
        return array.every((item) => {
            return fieldsToCheck.every((field) => {
                const value = item[field];
                return value !== '' && value !== null && value !== undefined;
            });
        });
    }
    useEffect(()=>{
console.log(linksInfo)
    },[linksInfo])
    useEffect(()=>{
        console.log(multiConnectionNodes)
            },[multiConnectionNodes])
    const isPressure = ['pressure'];
    const isFlowRate = ['flow_rate']

    if (multiConnectionNodes.length !== 0) {
        const pressureNotEmpty = areSpecificFieldsNotEmpty(multiConnectionNodes, isPressure);
        const flowRateNotEmpty = areSpecificFieldsNotEmpty(linksInfo, isFlowRate);
        if (!pressureNotEmpty) return
        if (!flowRateNotEmpty) return
    } else return


    return (
        <div className='resultBox'>
            <div className='result'>
                <h3>Результаты расчетов:</h3>
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
                <div className="renderResult">
                    {linksInfo.map((link, index) => (
                        <div key={index} className='resultElement'>
                            <h5>Труба {link.startName} - {link.endName}</h5>
                            <ul>
                                <li>Средняя скорость жидкости - <b>{link.flow_rate}</b> м/с </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RenderResult;