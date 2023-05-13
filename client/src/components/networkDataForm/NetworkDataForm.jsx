import React from 'react';

const NetworkDataForm = ({ generalData, handleGeneralDataChange}) => {
    return (
      <div>
        <h3>Общие параметры</h3>
        <label>
          Вязкость(Нс/м²):
          <input
            type="number"
            value={generalData.viscosity}
            onChange={handleGeneralDataChange('viscosity')}
          />
        </label>
        <label>
          Плотность(kg/m³):
          <input
            type="number"
            value={generalData.density}
            onChange={handleGeneralDataChange('density')}
          />
        </label>
        <label>
          Шероховатость(mm):
          <input
            type="number"
            value={generalData.roughness}
            onChange={handleGeneralDataChange('roughness')}
          />
        </label>
      </div>
    );
  };

export default NetworkDataForm;