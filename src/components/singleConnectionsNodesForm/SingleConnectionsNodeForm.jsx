import React, {useState} from 'react';

const SingleConnectionsNodeForm = ({ node, index, handleSingleNodeChange}) => {
    return (
      <div>
        <h5>Узел {node.name}</h5>
        <label>
          Давление:
          <input
            type="number"
            value={node.pressure}
            onChange={handleSingleNodeChange(index, 'pressure')}
          />
        </label>
        <label>
          Коэффициент гидравлического трения:
          <input
            type="number"
            value={node.frictionFactor}
            onChange={handleSingleNodeChange(index, 'frictionFactor')}
          />
        </label>
      </div>
    );
  };

export default SingleConnectionsNodeForm;