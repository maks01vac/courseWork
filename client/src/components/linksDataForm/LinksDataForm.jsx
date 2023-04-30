import React from 'react';

const LinksDataForm = ({ link, index, handleLinkInfoChange}) => {
    return (
      <div>
        <h5>
          Соединение {link.startName} - {link.endName}
        </h5>
        <label>
          Длина:
          <input
            type="number"
            value={link.length}
            onChange={handleLinkInfoChange(index, 'length')}
          />
        </label>
        <label>
          Диаметр:
          <input
            type="number"
            value={link.diameter}
            onChange={handleLinkInfoChange(index, 'diameter')}
          />
        </label>
        <label>
          Коэффициент гидравлического трения:
          <input
            type="number"
            value={link.resistanceFactor}
            onChange={handleLinkInfoChange(index, 'resistanceFactor')}
          />
        </label>
      </div>
    );
  };
  
    

export default LinksDataForm;