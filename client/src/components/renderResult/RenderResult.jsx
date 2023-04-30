import React from 'react';
import './styles/RenderResult.css'

const RenderResult = ({ multiConnectionNodes }) => {
    const areSpecificFieldsNotEmpty = (array, fieldsToCheck) => {
        return array.every((item) => {
            return fieldsToCheck.every((field) => {
                const value = item[field];
                return value !== '' && value !== null && value !== undefined;
            });
        });
    }

    const fieldsToCheck = ['fluidFlow', 'pressure'];

    if (multiConnectionNodes.length !== 0) {
        const allFieldsNotEmpty = areSpecificFieldsNotEmpty(multiConnectionNodes, fieldsToCheck);
        if (!allFieldsNotEmpty) return

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
                                <li>Расход жидкости: {node.fluidFlow}</li>
                                <li>Давление: {node.pressure}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RenderResult;