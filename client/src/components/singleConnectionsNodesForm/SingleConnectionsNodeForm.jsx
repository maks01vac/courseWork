import React, {useState} from 'react';

const SingleConnectionsNodeForm = ({ node, index, handleSingleNodeChange}) => {
    return (
      <div>
        <h5>Узел {node.name}</h5>
        <label>
          Давление(бары):
          <input
            type="number"
            value={node.pressure}
            onChange={handleSingleNodeChange(index, 'pressure')}
          />
        </label>
      </div>
    );
  };

export default SingleConnectionsNodeForm;