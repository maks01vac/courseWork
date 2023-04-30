import React, { useState, useEffect } from 'react';
import styles from './style/FormPipeParam.module.css';
import NetworkDataForm from '../networkDataForm/NetworkDataForm';
import LinksDataForm from '../linksDataForm/LinksDataForm';
import SingleConnectionsNodeForm from '../singleConnectionsNodesForm/SingleConnectionsNodeForm';
import axios from 'axios'
import LinksDataFormCollections from '../linksDataForm/LinksDataFormCollections';
import SingleConnectionsNodeFormCollections from '../singleConnectionsNodesForm/SingleConnectionsNodeFormCollections';
import RenderResult from '../renderResult/RenderResult';

const GraphDataForm = ({ graphData, setResult }) => {


  const [formData, setFormData] = useState({
    GeneralData: {
      viscosity: '',
      density: '',
      roughness: '',
      eps: '',
    },
    singleConnectionNodes: [],
    linksInfo: [],
    multiConnectionNodes: [],
    allNodes: []
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
      multiConnectionNodes: graphData.multiConnectionNodes.map((node) =>({
        ...node,
        fluidFlow:'',
        pressure:''
      })),
      allNodes: graphData.allNodes

    }));
  }, [graphData]);

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

  const unconnectedNodes = (graphData) => {
    const numNodes = graphData.allNodes.length
    const numEndNodes = graphData.singleConnectionNodes.length
    const numMultiNodes = graphData.multiConnectionNodes.length


    if (numNodes !== numEndNodes + numMultiNodes) {
      return false
    }
    return true
  }

  const calculationOfFluidFlowAndPressure = async () => {

    if (!isFormValid()) return alert('Заполните форму!')

    const existenseunconnectedNodes = unconnectedNodes(formData)
    if (!existenseunconnectedNodes) return alert('Соедините все узлы!')

    try {
      const result = await sendDataToServer(formData)
      setResult(result)
    } catch {
      alert('Что то пошло не так')

    }


  }

  async function sendDataToServer(graphData) {
    try {
      const response = await axios.post('http://localhost:3001/process-data', graphData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка отправки данных на сервер: ${error}`);
      throw error;
    }
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
          <SingleConnectionsNodeFormCollections
            singleConnectionNodes={formData.singleConnectionNodes}
            handleSingleNodeChange={handleSingleNodeChange}
          />
        </div>

        <div className={styles.form_section}>
          <LinksDataFormCollections
            links={formData.linksInfo}
            handleLinkInfoChange={handleLinkInfoChange}
          />
        </div>
        <button type="submit" onClick={calculationOfFluidFlowAndPressure}>
          Рассчитать
        </button>
        
      </div>
    </form>
  );
};

export default GraphDataForm;