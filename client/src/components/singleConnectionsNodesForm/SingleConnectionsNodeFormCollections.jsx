import React from 'react';
import SingleConnectionsNodeForm from './SingleConnectionsNodeForm';


const SingleConnectionsNodeFormCollections = ({ singleConnectionNodes, handleSingleNodeChange }) => {

    if(!singleConnectionNodes.length) {
        return <h3>Узлов с одним соединением нет</h3>
    }

    return (
        <div>
            <hr />
            <h3>Узлы с одним соединением:</h3>
            <hr />
            {singleConnectionNodes.map((node, index) => (
                <SingleConnectionsNodeForm
                    key={node.id}
                    node={node}
                    index={index}
                    handleSingleNodeChange={handleSingleNodeChange}
                />
            ))}
        </div>
    );
};

export default SingleConnectionsNodeFormCollections;