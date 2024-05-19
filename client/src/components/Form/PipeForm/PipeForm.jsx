
import React, { useState } from 'react';

const PipeForm = ({ pipe, index, handlePipeInfoChange, requireQext_w, requireLoss_coefficient, requiredAlpha_w_per_m2k }) => {



  return (
    <div>

      <h4>Труба от {pipe.startName} до {pipe.endName}</h4>

      {/* Обязательные поля */}
      <label>
        Длина (km):
        <input
          type="number"
          value={pipe.length}
          onChange={handlePipeInfoChange("pipes",index, "length")}
        /> 
      </label>
      <label>
        Диаметр (m):
        <input
          type="number"
          value={pipe.diameter}
          onChange={handlePipeInfoChange("pipes",index, "diameter")}
        />
      </label>
      <label>
        {/* Необязательные поля */}
        {requireQext_w && (
          <>
          Дополнительный тепловой поток:
          <input
            type="number"
            value={pipe.qext_w}
            onChange={handlePipeInfoChange("pipes", index, "qext_w")}
          />
          </>
        )}
      </label>
      <label>
        {requiredAlpha_w_per_m2k && (
          <>
          Коэффициент теплопередачи (W/(m²·K)):
          <input
            type="number"
            value={pipe.alpha_w_per_m2k}
            onChange={handlePipeInfoChange("pipes", index, "alpha_w_per_m2k")}
          />
          </>
        )}
        
      </label>
      <label>
        {requireLoss_coefficient && (
          <>
            коэффициент потерь:
            <input
              type="number"
              value={pipe.loss_coefficient}
              onChange={handlePipeInfoChange("pipes", index, "loss_coefficient")}
            />
          </>
        )}
      </label>
    </div>
  );
};

export default PipeForm;