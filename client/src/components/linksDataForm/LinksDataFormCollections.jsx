import React from 'react';
import LinksDataForm from './LinksDataForm';

const LinksDataFormCollections = ({links, handleLinkInfoChange}) => {

    if(!links.length){
        return <h3>Соединений нет</h3>
    }

    return (
        <div>
            <hr/>
          <h3>Соединения</h3>
          <hr/>
             {links.map((link, index) => (
            <LinksDataForm
              key={`${link.startId}-${link.endId}`}
              link={link}
              index={index}
              handleLinkInfoChange={handleLinkInfoChange}
            />))}
        </div>
    );
};

export default LinksDataFormCollections;