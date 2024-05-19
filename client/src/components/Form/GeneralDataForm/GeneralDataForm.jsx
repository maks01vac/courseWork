import React from 'react';

const GeneralDataForm = ({ generalData, handleGeneralDataChange, fluids}) => {


  const fluidOptions = Object.keys(fluids);

  return (
    <div>
      <label>
        Жидкость:
        <select
          value={generalData?.fluid?.name_rus}
          onChange={handleGeneralDataChange('fluid')}
        >
          {fluidOptions?.map(fluid => (
            <option key={fluid} value={fluid}>{fluid}</option>
          ))}
        </select>
      </label>
      <label>
        Шероховатость труб(mm):
        <input
          type="number"
          value={generalData?.roughness}
          onChange={handleGeneralDataChange('roughness')}
        />
      </label>
    </div>
  );
};

export default GeneralDataForm;