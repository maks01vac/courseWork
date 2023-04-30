import React from 'react'
import Calc from '../calc/Calc.jsx'
import DescriptionCalc from '../descriptionCalc/DescriptionCalc.jsx';
import './styles/Main.css'

const Main = () => {
  return (
    <main>
      <div className="main">
        <DescriptionCalc/>
        <Calc/>
      </div>
      
    </main>
  );
};

export default Main;
