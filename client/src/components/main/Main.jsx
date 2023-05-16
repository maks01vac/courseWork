import React from 'react'
import Calc from '../Calc/Calc.jsx';
import DescriptionCalc from '../DescriptionCalc/DescriptionCalc.jsx';
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
