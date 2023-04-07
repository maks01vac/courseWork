import React from 'react'
import Calc from '../calc/Calc.jsx'

const Main = ({children}) => {
  return (
    <div>
    {children}
    <Calc/>
    </div>
  );
};

export default Main;
