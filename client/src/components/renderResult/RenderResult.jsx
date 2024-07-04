import React, { useEffect } from 'react';
import './styles/RenderResult.css'
import { useGraphData } from '../../GraphDataContext/GraphDataContext';


const RenderResult = () => {

    const { results, setResults } = useGraphData();

    if (results.length == 0) return null




    return (
        <div className='resultBox'>
            <div className='result'>
                <h2>Результаты расчётов:</h2>
                {results.map((result, index) => {
                    if (!result || !result.components) return null; // Проверка на наличие результатов и компонентов
                    return (
                        <div key={index} className='pipeRes'>
                            <div className='result-component-box'>
                                <h3>Соединения</h3>
                                {result.components.junctions.map((junction) => (
                                    <div key={Number(junction.id)} className='result-component-elem-box'>
                                        <h4>{junction.name}:</h4>
                                        <ul>
                                            <li>Давление: {junction.results.p_bar} бар</li>
                                            <li>Температура: {junction.results.t_k} К</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className='result-component-box'>
                                <h3>Трубы</h3>
                                {result.components.pipes.map((pipe) => (
                                    <div key={Number(pipe.startId * 2)} className='result-component-elem-box'>
                                        <h4>Труба ({pipe.startName} {'-'} {pipe.endName}):</h4>
                                        <ul>
                                            <li>Средняя скорость: {pipe.results.velocity_mean} м/с</li>
                                            <li>Давление на входе: {pipe.results.pressure_from} бар</li>
                                            <li>Давление на выходе: {pipe.results.pressure_to} бар</li>
                                            <li>Температура на входе: {pipe.results.temperature_from} К</li>
                                            <li>Температура на выходе: {pipe.results.temperature_to} К</li>
                                            <li>Массовый поток на входе: {pipe.results.mass_flow_from} кг/с</li>
                                            <li>Массовый поток на выходе: {pipe.results.mass_flow_to} кг/с</li>
                                            <li>Нормированный объёмный поток: {pipe.results.volume_flow_norm} м³/с</li>
                                            <li>Число Рейнольдса: {pipe.results.reynolds_number}</li>
                                            <li>Коэффициент трения: {pipe.results.friction_factor}</li>
                                        </ul>

                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RenderResult;