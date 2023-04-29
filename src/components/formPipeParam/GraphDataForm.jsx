import React, { useState, useEffect } from 'react';
import styles from './style/FormPipeParam.module.css';
import NetworkDataForm from '../networkDataForm/NetworkDataForm';
import LinksDataForm from '../linksDataForm/LinksDataForm';
import SingleConnectionsNodeForm from '../singleConnectionsNodesForm/SingleConnectionsNodeForm';

const GraphDataForm = ({ graphData }) => {
  const [formData, setFormData] = useState({
    GeneralData: {
      viscosity: '',
      density: '',
      roughness: '',
      eps: '',
    },
    singleConnectionNodes: [],
    linksInfo: [],
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      singleConnectionNodes: graphData.singleConnectionNodes.map((node) => ({
        ...node,
        pressure: '',
        frictionFactor: '',
      })),
      linksInfo: graphData.linksInfo.map((link) => ({
        ...link,
        length: '',
        diameter: '',
        resistanceFactor: '',
      })), 
      multiConnectionNodes: graphData.multiConnectionNodes
    }));

    // console.log('GraphData change', graphData);
  }, [graphData]);

  // useEffect(() => {
  //   console.log('FormData change', formData);
  // }, [formData]);
  const handleGeneralDataChange = (field) => (event) => {
    setFormData({
      ...formData,
      GeneralData: {
        ...formData.GeneralData,
        [field]: event.target.value,
      },
    });
  };

  const handleSingleNodeChange = (index, field) => (event) => {
    const newNodes = [...formData.singleConnectionNodes];
    newNodes[index][field] = event.target.value;
    setFormData({ ...formData, singleConnectionNodes: newNodes });
  };

  const handleLinkInfoChange = (index, field) => (event) => {
    const newLinks = [...formData.linksInfo];
    newLinks[index][field] = event.target.value;
    setFormData({ ...formData, linksInfo: newLinks });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Здесь вы можете обработать отправку формы и передать данные назад в Calc
  };

  const isFormValid = () =>
    formData.GeneralData.viscosity &&
    formData.GeneralData.density &&
    formData.GeneralData.roughness &&
    formData.GeneralData.eps &&
    formData.singleConnectionNodes.every(
      (node) => node.pressure && node.frictionFactor
    ) &&
    formData.linksInfo.every(
      (link) => link.length && link.diameter && link.resistanceFactor
    );

    const formValid = () =>{
      if(isFormValid()){

        getResult()

      }else{
        alert('Заполните форму')
      }
    }
  
    const getResult = () =>{
      console.log(formData)
    }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.form_container}>
        <div className={styles.form_section}>
          <NetworkDataForm
            generalData={formData.GeneralData}
            handleGeneralDataChange={handleGeneralDataChange}
          />
        </div>
        <div className={styles.form_section}>
        <hr/>
          <h3>Узлы с одним соединением</h3>
          <hr/>
          {formData.singleConnectionNodes.map((node, index) => (
            <SingleConnectionsNodeForm
              key={node.id}
              node={node}
              index={index}
              handleSingleNodeChange={handleSingleNodeChange}
            />
          ))}
        </div>
        <div className={styles.form_section}>
          <hr/>
          <h3>Соединения</h3>
          <hr/>
          {formData.linksInfo.map((link, index) => (
            <LinksDataForm
              key={`${link.startId}-${link.endId}`}
              link={link}
              index={index}
              handleLinkInfoChange={handleLinkInfoChange}
            />
          ))}
        </div>
        <button type="submit" onClick={formValid}>
          Отправить
        </button>
      </div>
    </form>
  );
};

export default GraphDataForm;