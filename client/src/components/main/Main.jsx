import React from 'react'
import './styles/Main.css'
import InfoBlock from '../InfoBlock/InfoBlock.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext/AuthContext.js';


const Main = ( {setShowLogin, setModalOpen}) => {

  const navigate = useNavigate()
  const {isAuthenticated} = useAuth()
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

  const navigateToNewPipeline = () =>{
    if(isAuthenticated){
      navigate('/dashboard/new-pipeline')
    } else{
      setShowLogin(true)
      setModalOpen(true)
    }
  }



  return (
    <div className="main">
      <div className="content">
        <div className="top-block">
          <div className="overlay-block">
            <div className="main-text">Полезный инструмент для проектирования и анализа трубопроводных систем</div>
            <div className="main-text right-text">Оптимизируйте потоки в трубопроводах с нашим удобным онлайн-калькулятором.
              Идеальное решение для инженеров, студентов и исследователей.</div>
          </div>
          <div className="new-project">
            <div className="new-project-text">Создай свою первую сеть</div>
            <button className="new-project-button" onClick={() => navigateToNewPipeline()}>+ Новая сеть</button>
          </div>
        </div>
      </div>
      <div className="info-blocks">
        <div className="content info-items">
          {infoBlocksContent.map((item) => (
            <InfoBlock title={item.title} content={item.content} isList={item.isList} />))}
        </div>
      </div>
      <div className="about-section">
        <h3>О нас</h3>
        <p>Добро пожаловать на PipeNetCalc - инструмент, призванный сделать расчеты трубопроводных сетей максимально доступными и удобными для всех.</p>

        <p>Меня зовут Максим, я студент 5-го курса математического факультета Кубанского государственного университета.
          Этот проект - кульминация моего академического пути и увлечения прикладной математикой и программированием.
          Во время учебы я увлекся возможностью использования математических алгоритмов для решения реальных инженерных задач, что привело к созданию PipeNetCalc,
          моего дипломного проекта.</p>

          <p>
            
          PipeNetCalc - это результат многомесячных исследований и разработок, целью которых было создание инструмента, 
          способного упростить и автоматизировать процесс расчета параметров трубопроводной сети. 
          Особенностью этого инструмента является то, что он прост и доступен для неспециалистов, но при этом достаточно мощный, 
          чтобы быть полезным опытным инженерам и экспертам.
          </p>

          <p>Задача PipeNetCalc - обеспечить надежные и точные расчеты, сэкономив ваше время и ресурсы. 
            Я надеюсь, что это приложение окажется ценным ресурсом для студентов, инженеров, академического и 
            профессионального сообщества.</p>
      </div>
    </div>
  );
};

export default Main;
