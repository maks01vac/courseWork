import React from 'react';

const SinkForm = ({ sink, index, showMdotKgPerS, showScaling, handleComponentChange }) => {
  return (
    <div>
      <h4>Сток: {sink.name}</h4>
      {showMdotKgPerS && (
        <div>
          <label>
            Массовый поток (kg/s):
            <input
              type="number"
              value={sink.mdot_kg_per_s}
              onChange={handleComponentChange("sinks", index, "mdot_kg_per_s")}
            />
          </label>
        </div>
      )}
      {showScaling && (
        <div>
          <label>
            Коэффициент масштабирования:
            <input
              type="text"
              value={sink.scaling}
              onChange={handleComponentChange("sinks", index, "scaling")}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default SinkForm;