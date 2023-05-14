import React, { useEffect } from 'react';
import './styles/RenderResult.css'
import RenderFlow from './RenderFlow';
import RenderPressure from './RenderPressure';

const RenderResult = ({ results, setResults, idPipe }) => {

    if (results.length == 0) return null

    const clearResults = () => {
        setResults([])
        idPipe.current = 1
    }

    const deleteResult = (deleteIdPipe) =>{
        const filterResults = results.filter(pipeRes => pipeRes.idPipe!==deleteIdPipe)
        if (filterResults.length === 0){
            idPipe.current = 1
        }
        setResults(filterResults)

    }

    return (
        <div className='resultBox'>
            <div className='result'>
                <h3>Результаты расчетов:</h3>
                {results.map((result, index) => (
                    <div key={index} className='pipeRes'>
                        <p>Трубопроводная сеть №{result.idPipe}</p>
                        {result.multiConnectionNodes.length!==0 ? <RenderPressure multiConnectionNodes={result.multiConnectionNodes} /> : <p></p>}
                        <RenderFlow linksInfo={result.linksInfo} />
                        <button className="deleteResult" onClick={() => deleteResult(result.idPipe)}>Удалить результат</button>
                    </div>
                ))}
                <button onClick={clearResults}>Очистить результаты</button>
            </div>

        </div>
    );
};

export default RenderResult;