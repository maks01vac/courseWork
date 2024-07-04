import React from 'react';

const PumpForm = ({ pump, index, handleComponentChange, showPumpMassFlowAndPressure }) => {
  const pumpOptions = ['P1', 'P2', 'P3']

  return (
    <div>
      <h4>{pump.name}</h4>
      <div>
        {showPumpMassFlowAndPressure ? (<>
          <div>
            <label>
              Массовый поток (kg/s):
              <input
                type="number"
                value={pump.mdot_flow_kg_per_s}
                onChange={handleComponentChange("pumps", index, "mdot_flow_kg_per_s")}
              />
            </label>
          </div>
          <div>
            <label>
              Подъем давления (kg/s):
              <input
                type="number"
                value={pump.p_flow_bar}
                onChange={handleComponentChange("pumps", index, "p_flow_bar")}
              />
            </label>
          </div>
        </>) : (<>
          <label>
            Тип насоса:
            <select
              value={pump.type}
              onChange={handleComponentChange('pumps', index, 'type')}
            >
              {pumpOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </>)}
      </div>
    </div>

  );
};

export default PumpForm;