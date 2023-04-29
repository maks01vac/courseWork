import React from 'react';

const NetworkDataForm = ({ generalData, handleGeneralDataChange}) => {
    return (
      <div>
        <h3>Общие параметры</h3>
        <label>
          Вязкость:
          <input
            type="number"
            value={generalData.viscosity}
            onChange={handleGeneralDataChange('viscosity')}
          />
        </label>
        <label>
          Плотность:
          <input
            type="number"
            value={generalData.density}
            onChange={handleGeneralDataChange('density')}
          />
        </label>
        <label>
          Шероховатость:
          <input
            type="number"
            value={generalData.roughness}
            onChange={handleGeneralDataChange('roughness')}
          />
        </label>
        <label>
          eps:
          <input
            type="number"
            value={generalData.eps}
            onChange={handleGeneralDataChange('eps')}
          />
        </label>
      </div>
    );
  };

export default NetworkDataForm;