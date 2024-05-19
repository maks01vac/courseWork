import React, { createContext, useState, useContext, useRef } from 'react';

// Создание контекста
const GraphDataContext = createContext();

// Провайдер контекста
export const GraphDataProvider = ({ children }) => {

    const initialPipeModelInfo = {
        idPipe: '',
        allNodes: [],
        linksInfo: [],
        components: {
            ext_grids: [],
            junctions: [],
            links: [],
            pipes: [],
            sinks: [],
            sources: [],
        }
    };
    const [pipeModelInfo, setPipeModelInfo] = useState(initialPipeModelInfo);
    const shouldBuildGraph = useRef(false)

    const resetPipeModelInfo = () => {
        setPipeModelInfo({...initialPipeModelInfo});
    };
    
    const [results, setResults] = useState([]);

    const value = {
        pipeModelInfo,
        setPipeModelInfo,
        results,
        resetPipeModelInfo,
        setResults,
        shouldBuildGraph
    };

    return (
        <GraphDataContext.Provider value={value}>
            {children}
        </GraphDataContext.Provider>
    );
};

// Хук для использования контекста
export const useGraphData = () => useContext(GraphDataContext);