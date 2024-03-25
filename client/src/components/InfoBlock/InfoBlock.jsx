// InfoBlock.js
import React from 'react';
import './style/InfoBlock.css'; // Импортируем стили

const InfoBlock = ({ title, content, isList }) => {
    return (
        <div className="info-block">
            <h2 className="info-block-title">{title}</h2>
            <div className="content">
                <p className="info-block-content">{content}</p>
                {isList ? (
                    <ul className="info-block-list">
                        {isList.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (<p></p>)}
            </div>


        </div>
    );
};

export default InfoBlock;