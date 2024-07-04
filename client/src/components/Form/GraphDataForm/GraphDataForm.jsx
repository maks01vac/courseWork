import React, { useState, useEffect } from 'react';
import styles from './style/FormPipeParam.module.css';
import GeneralDataForm from '../GeneralDataForm/GeneralDataForm';
import axios from 'axios'
import Loader from '../../loader/Loader';
import validateNetworkData from './validator/validatorPipelineData.js';
import PipeForm from '../PipeForm/PipeForm.jsx';
import ExtGridForm from '../ExtGridForm/ExtGridForm.jsx';
import SourceForm from '../SourceForm/SourceForm.jsx';
import SinkForm from '../SinkForm/SinkForm.jsx';
import Modal from '../../Modal/Modal.jsx';
import { useGraphData } from '../../../GraphDataContext/GraphDataContext.js';
import PumpForm from '../PumpForm/PumpForm.jsx';


const GraphDataForm = () => {


  const [isLoading, setIsLoading] = useState(false)

  const [requiredAlpha_w_per_m2k, setRequiredAlpha_w_per_m2k] = useState(false)
  const [requireLoss_coefficient, setRequireLoss_coefficient] = useState(false)
  const [requireQext_w, setRequireQext_w] = useState(false)

  const [showMdotKgPerS, setShowMdotKgPerS] = useState(false);
  const [showScaling, setShowScaling] = useState(false);

  const [showMdotKgPerSForSinks, setShowMdotKgPerSForSinks] = useState(false);
  const [showScalingForSinks, setShowScalingForSinks] = useState(false);
  const [showPumpMassFlowAndPressure, setShowPumpMassFlowAndPressure] = useState(false);

  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { pipeModelInfo, setPipeModelInfo, results, setResults } = useGraphData();

  const fluids = {
    вода: { name_rus: "вода", name_pp: "water" },
    газы_насыщенный: { name_rus: "газы_насыщенный", name_pp: "hgas" },
    газы_ненасыщенный: { name_rus: "газы_ненасыщенный", name_pp: "lgas" },
    водород: { name_rus: "водород", name_pp: "hydrogen" },
    метан: { name_rus: "метан", name_pp: "methane" },
    биометан_чистый: { name_rus: "биометан_чистый", name_pp: "biomethane_pure" },
    биометан_очищенный: { name_rus: "биометан_очищенный", name_pp: "biomathane_treated" },
    воздух: { name_rus: "воздух", name_pp: "air" }
  };


  // useEffect(() => {
  //   setFormData(pipeModelInfo)
  //   console.log(formData)
  // }, [pipeModelInfo]);
  // useEffect(() => {
  //   console.log(formData)
  // }, [formData]);

  const handleGeneralDataChange = (field) => (event) => {
    let value = event.target.value
    // Получаем список текущих компонентов данного типа

    if (field === 'fluid') {
      value = fluids[value];
    }
    // Обновляем formData с новым списком компонентов для данного типа
    setPipeModelInfo(prevFormData => ({
      ...prevFormData,
      generalData: {
        ...prevFormData.generalData,
        [field]: value
      }
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
  };


  const handleComponentChange = (componentType, index, field) => (event) => {
    const newValue = event.target.value;

    setPipeModelInfo(prevState => {
      // Создаем копию текущих компонентов
      const updatedComponents = [...prevState.components[componentType]];

      // Обновляем нужный компонент
      updatedComponents[index] = {
        ...updatedComponents[index],
        [field]: newValue  // Устанавливаем новое значение для поля
      };

      // Возвращаем новый объект состояния
      return {
        ...prevState,
        components: {
          ...prevState.components,
          [componentType]: updatedComponents
        }
      };
    });
  };

  function resetField(require, setRequire, param, field) {
    setRequire(!require)

    if (!require == false) {
      const reset = pipeModelInfo.components[param]
      const resetField = reset.map(par => {
        return { ...par, [field]: '' }
      })

      setPipeModelInfo({
        ...pipeModelInfo,
        components: {
          ...pipeModelInfo.components,
          [param]: resetField
        }
      })
    }
  }

  const calculationOfFluidFlowAndPressure = async () => {
    try {

      const errorsValue = validateNetworkData.validateFormValue(pipeModelInfo);
      if (errorsValue.length > 0) {
        console.log("Найдены ошибки:", errorsValue);
        setError(errorsValue);
        setShowErrorModal(true);
        return
      }
      setIsLoading(true);
      const result = await sendDataToServer(pipeModelInfo);
      setIsLoading(false);
      if (result) {
        setResults([result]);
      }

    } catch (e) {
      console.log(e);
      setError(`Ошибка при расчете данных. Проверьте входные данные и попробуйте снова.${e}`);
      setShowErrorModal(true);
      setIsLoading(false);
    }
  }

  async function sendDataToServer(graphData) {
    try {
      const response = await axios.post('http://localhost:3001/api/pipelineCalc', graphData);
      // const newPipeline = await axios.post('http://localhost:3001/api/user/2/pipelines', response.data);
      // response.data.idPipe = newPipeline.data.pipelineid
      return response.data

    } catch (error) {
      setError(`Ошибка при расчете данных. Проверьте входные данные и попробуйте снова.`);
      setShowErrorModal(true);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.form_container}>
        <h3>Общие параметры</h3>
        <div className={styles.form_section}>
          <GeneralDataForm
            fluids={fluids}
            generalData={pipeModelInfo.generalData}
            handleGeneralDataChange={handleGeneralDataChange}
          />
        </div>
        {pipeModelInfo.components?.pipes ? (
          <>
            <h3>Трубы</h3>
            <div className={styles.form_section}>
              <div className={styles.checkbox}>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => resetField(requireQext_w, setRequireQext_w, 'pipes', "qext_w")}
                  />Учесть дополнительный тепловой поток</div>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => resetField(requiredAlpha_w_per_m2k, setRequiredAlpha_w_per_m2k, "pipes", "alpha_w_per_m2k")}
                  />Учесть коэффициент теплопередачи</div>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => resetField(requireLoss_coefficient, setRequireLoss_coefficient, "pipes", "loss_coefficient")}
                  />Учесть коэффициент потерь</div>
              </div>

              {pipeModelInfo.components?.pipes.map((pipe, index) => (
                <PipeForm
                  requiredAlpha_w_per_m2k={requiredAlpha_w_per_m2k}
                  requireLoss_coefficient={requireLoss_coefficient}
                  requireQext_w={requireQext_w}
                  key={index}
                  pipe={pipe}
                  index={index}
                  handlePipeInfoChange={handleComponentChange}
                />
              ))}
            </div>
          </>
        ) : (<h3>Труб нет</h3>)}



        {pipeModelInfo.components?.ext_grids?.length > 0 ? (
          <>
            <h3>Внешние сети</h3>
            <div className={styles.form_section}>
              {pipeModelInfo.components.ext_grids.map((extGrid, index) => (
                <ExtGridForm
                  key={index}
                  extGrid={extGrid}
                  handleExtGridChange={handleComponentChange}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <h3>Внешних сетей нет</h3>
        )}

        {pipeModelInfo.components?.pumps?.length > 0 ? (
          <>
            
            <h3>Насосы</h3>
            <div className={styles.form_section}>
            <div className={styles.checkbox}>
              <div>
                <input
                  type="checkbox"
                  onChange={() => {
                    resetField(showPumpMassFlowAndPressure, setShowPumpMassFlowAndPressure, "pumps", "mdot_flow_kg_per_s")
                    resetField(showPumpMassFlowAndPressure, setShowPumpMassFlowAndPressure, "pumps", "p_flow_bar")
                  }}
                />Задать массовый поток и подъем давления вручную</div>
            </div>
              {pipeModelInfo.components.pumps.map((pump, index) => (
                <PumpForm
                  key={index}
                  index={index}
                  pump={pump}
                  handleComponentChange={handleComponentChange}
                  showPumpMassFlowAndPressure={showPumpMassFlowAndPressure} />
              ))}
            </div>
          </>
        ) : (<></>)
        }

        {pipeModelInfo.components?.sinks?.length > 0 ? (
          <>
            <h3>Стоки</h3>
            <div className={styles.form_section}>
              <div className={styles.checkbox}>
                <div>
                  <input
                    type="checkbox"
                    checked={showMdotKgPerSForSinks}
                    onChange={() => resetField(showMdotKgPerSForSinks, setShowMdotKgPerSForSinks, 'sinks', 'mdot_kg_per_s')}
                  />
                  Учесть массовый поток
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={showScalingForSinks}
                    onChange={() => resetField(showScalingForSinks, setShowScalingForSinks, 'sinks', 'scaling')}
                  />
                  Учесть коэффициент масштабирования
                </div>
              </div>


              {showMdotKgPerSForSinks || showScalingForSinks ? (pipeModelInfo.components.sinks.map((sink, index) => (
                <SinkForm
                  key={index}
                  sink={sink}
                  index={index}
                  showMdotKgPerS={showMdotKgPerSForSinks}
                  showScaling={showScalingForSinks}
                  handleComponentChange={handleComponentChange}
                />
              ))) : (<></>)}
            </div>
          </>
        ) : (<></>)}


        {pipeModelInfo.components?.sources?.length > 0 ? (
          <>
            <h3>Источники</h3>
            <div className={styles.form_section}>
              <div className={styles.checkbox}>
                <div>
                  <input
                    type="checkbox"
                    checked={showMdotKgPerS}
                    onChange={() => resetField(showMdotKgPerS, setShowMdotKgPerS, 'sources', 'mdot_kg_per_s')}
                  />
                  Учесть массовый поток
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={showScaling}
                    onChange={() => resetField(showScaling, setShowScaling, 'sources', 'scaling')}
                  />
                  Учесть коэффициент масштабирования
                </div>
              </div>
              {showMdotKgPerS || showScaling ? (pipeModelInfo.components.sources.map((source, index) => (
                <SourceForm
                  key={source.id}
                  source={source}
                  index={index}
                  showMdotKgPerS={showMdotKgPerS}
                  showScaling={showScaling}
                  handleComponentChange={handleComponentChange}
                />
              ))) : (<></>)}
            </div>
          </>
        ) : (<></>)}
        <div>
          {!(results?.length != 0 || isLoading) ? <button type="submit" onClick={calculationOfFluidFlowAndPressure}>Начать расчеты</button> : (<></>)}
          <Loader isVisible={isLoading} />
        </div>

        <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)}>
          <div className="error-modal-content">
            <h4>Ошибки валидации</h4>
            <ul>
              {Array.isArray(error) ? (
                error.map((err, index) => <li key={index}>{err}</li>)
              ) : (
                <li>{error}</li>  // Предполагается, что error может быть строкой или другим не массивным значением
              )}
            </ul>
            <button onClick={() => setShowErrorModal(false)}>OK</button>
          </div>
        </Modal>
      </div>
    </form >
  );
};

export default GraphDataForm;