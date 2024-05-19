import React from 'react';

const PumpForm = ({ pump, index, handleComponentChange }) => {
  const pumpOptions = ['P1', 'P2', 'P3']

  return (
    <div>
      <h4>{pump.name}</h4>
      <div>
        <label>
          Тип насоса:
          <select
            value={pump.type}
            onChange={handleComponentChange('pumps',index,'type')}
          >
            {pumpOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
    </div>

  );
};

export default PumpForm;