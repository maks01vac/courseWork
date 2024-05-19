import React from 'react';

const ExtGridForm = ({ extGrid, handleExtGridChange, index }) => {
  return (
    <div>
      <h4>Внешняя сеть: {extGrid.name}</h4>
      <label>
        Давление:
        <input
          type="number"
          value={extGrid.pressure}
          onChange={handleExtGridChange("ext_grids", index, "pressure")}
        />
      </label>
    </div>
  );
};

export default ExtGridForm;