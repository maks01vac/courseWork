import React from 'react'
import './styles/Main.css'
import InfoBlock from '../InfoBlock/InfoBlock.jsx';
import Calc from '../Calc/Calc.jsx';


const Main = () => {

  const infoBlocksContent = [{
    title: 'Для кого?',
    content: 'Этот проект пригодится для:',
    isList: ['Студентов', 'Инженеров', 'Компаний']
  },
  {
    title: 'Для чего?',
    content: `Этот проект создан для облегчения расчетов связанных 
              трубопроводных сетей. Он поможет вам построить 
              топологию сети и провести необходимые расчеты на 
              основе данных.`,
    isList: [],
    
  },
  {
    title: 'Почему мы?',
    content: `Данный инструмент позволяет без всяких знаний программирования 
    точно смоделировать трубопроводные сети и получить качественные расчеты за несколько минут`,
    isList: [],
    
  }]



  return (
    <div className="main">
      <div className="content">
        <div className="top-block">
          <div className="overlay-block">
            <div className="main-text">Этот калькулятор поможет c вычислениями в трубопроводных сетях</div>
            <div className="main-text right-text">С помощью этого калькулятора вы сможете рассчитать скорость
              течения жидкости в трубах и давление в поперечных узлах.</div>
          </div>
          <div className="new-project">
            <div className="new-project-text">Создай свой первую сеть</div>
            <button className="new-project-button">+ Новая сеть</button>
          </div>
        </div>
      </div>
      <div className="info-blocks">
        <div className="content info-items">
          {infoBlocksContent.map((item) => (
            <InfoBlock title={item.title} content={item.content} isList={item.isList} />))}
        </div>
      </div>
      <div className="user-guide-section">
            <Calc/>
      </div>
      <div className="FAQ-section">

      </div>
      <div className="about-section">

      </div>
      <div className="footer">

      </div>
    </div>
  );
};

export default Main;
