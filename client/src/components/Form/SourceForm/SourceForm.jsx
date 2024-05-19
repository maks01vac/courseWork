const SourceForm = ({ source, index, showMdotKgPerS, showScaling, handleComponentChange }) => {
    return (
      <div>
        <h4>Источник: {source.name}</h4>
        {showMdotKgPerS && (
          <div>
            <label>
              Массовый поток (kg/s):
              <input
                type="number"
                value={source.mdot_kg_per_s}
                onChange={handleComponentChange('sources', index, 'mdot_kg_per_s')}
              />
            </label>
          </div>
        )}
        {showScaling && (
          <div>
            <label>
              Коэффициент масштабирования:
              <input
                type="number"
                value={source.scaling}
                onChange={handleComponentChange('sources', index, 'scaling')}
              />
            </label>
          </div>
        )}
      </div>
    );
  };
  
  export default SourceForm;