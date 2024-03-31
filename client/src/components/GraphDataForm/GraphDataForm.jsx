import React, { useState, useEffect} from 'react';
import styles from './style/FormPipeParam.module.css';
import GeneralDataForm from '../GeneralDataForm/GeneralDataForm';
import axios from 'axios'
import LinksDataFormsCollection from '../LinksDataForm/LinksDataFormsCollection';
import SingleConnectionsNodeFormsCollection from '../SingleConnectionsNodesForm/SingleConnectionsNodeFormsCollection';
import isSimilarResult from './utils/isSimilarResult.js';
import Loader from '../loader/Loader';


const GraphDataForm = ({ idPipe, graphData, results, setResults }) => {


  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    idPipe:'',
    generalData: {
      viscosity: '',
      density: '',
      roughness: '',
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
      })),
      linksInfo: graphData.linksInfo.map((link) => ({
        ...link,
        length: '',
        diameter: '',
      })),
      multiConnectionNodes: graphData.multiConnectionNodes.map((node) =>({
        ...node,
      })),
      allNodes: graphData.allNodes

    }));
  }, [graphData]);

  const handleGeneralDataChange = (field) => (event) => {
    setFormData({
      ...formData,
      generalData: {
        ...formData.generalData,
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
    formData.generalData.viscosity &&
    formData.generalData.density &&
    formData.generalData.roughness &&
    formData.singleConnectionNodes.every(
      (node) => node.pressure
    ) &&
    formData.linksInfo.every(
      (link) => link.length && link.diameter
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
      setIsLoading(true)
      const result = await sendDataToServer(formData)
      setIsLoading(false)
      const existanceCheck = isSimilarResult(result,results)
      
      if(existanceCheck){
        result.idPipe = idPipe.current
        setResults([...results, result])
        idPipe.current++
      }

    } catch(e) {
      console.log(e)
      alert('Что то пошло не так')

    }


  }

  async function sendDataToServer(graphData) {
    try {
      const response = await axios.post('http://localhost:3001/api/pipelineCalc', graphData);
      console.log(response.data)
      await axios.post('http://localhost:3001/api/user/2/pipelines', response.data);
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
          <GeneralDataForm
            generalData={formData.generalData}
            handleGeneralDataChange={handleGeneralDataChange}
          />
        </div>

        <div className={styles.form_section}>
          <SingleConnectionsNodeFormsCollection
            singleConnectionNodes={formData.singleConnectionNodes}
            handleSingleNodeChange={handleSingleNodeChange}
          />
        </div>

        <div className={styles.form_section}>
          <LinksDataFormsCollection
            links={formData.linksInfo}
            handleLinkInfoChange={handleLinkInfoChange}
          />
        </div>
        <button type="submit" onClick={calculationOfFluidFlowAndPressure}>
          Рассчитать
        </button>
        <Loader isVisible={isLoading}/>
        
      </div>
    </form>
  );
};

export default GraphDataForm;