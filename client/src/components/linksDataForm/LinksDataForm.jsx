import React from 'react';

const LinksDataForm = ({ link, index, handleLinkInfoChange}) => {
  

    return (
      <div>
        <h5>
          Соединение {link.startName} - {link.endName}
        </h5>
        <label>
          Длина(km):
          <input
            type="number"
            value={link.length}
            onChange={handleLinkInfoChange(index, 'length')}
          />
        </label>
        <label>
          Диаметр(m):
          <input
            type="number"
            value={link.diameter}
            onChange={handleLinkInfoChange(index, 'diameter')}
          />
        </label>
      </div>
    );
  };
  
    

export default LinksDataForm;