import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ children, isOpen, onClose }) => {


  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };

    // Добавление обработчика событий для всего окна
    window.addEventListener('keydown', handleEsc);

    // Удаление обработчика событий при размонтировании компонента
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]); // Указание зависимостей хука

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }

  if (!isOpen) {
    document.body.style.overflow = 'unset';
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" style={{}} onClick={handleModalClick}>
        {children}
      </div>
    </div>
  );
};

export default Modal;