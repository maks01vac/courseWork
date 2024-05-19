import junctionIcons from '../../Dashboard/Icons/junction_icon.png';
import sourceIcons from '../../Dashboard/Icons/source_icon.png';
import pumpIcons from '../../Dashboard/Icons/pump_icon.png';
import sinkIcons from '../../Dashboard/Icons/sink_icon.png';
import externalGridIcons from '../../Dashboard/Icons/external_grid_icon.png';

 const styles = [
    {
      selector: 'node[type="junction"]',
      style: {
        'background-image': `url(${junctionIcons})`,
        'background-fit': 'cover',
        'background-color': 'white',
        'width': 50,
        'height': 40,
        label: 'data(name)',
        shape: 'rectangle'
      },
    },
    {
      selector: 'node[type="source"]',
      style: {
        'background-color': 'white',
        'background-image': `url(${sourceIcons})`,
        'background-fit': 'cover',
        'width': 45,
        'height': 45,
        label: 'data(name)',
        shape: 'roundrectangle',
      },
    },
    {
      selector: 'node[type="pump"]',
      style: {
        'background-color': 'white',
        'background-image': `url(${pumpIcons})`,
        'background-fit': 'cover',
        'width': 45,
        'height': 40,
        label: 'data(name)',
        shape: 'roundrectangle',
      },
    },
    {
      selector: 'node[type="sink"]',
      style: {
        'background-color': 'white',
        'background-image': `url(${sinkIcons})`,
        'background-fit': 'cover',
        'width': 50,
        'height': 50,
        label: 'data(name)',
        shape: 'roundrectangle',
      },
    },

    {
      selector: 'node[type="external-grid"]',
      style: {
        'background-color': 'white',
        'background-image': `url(${externalGridIcons})`,
        'background-fit': 'cover',
        'width': 50,
        'height': 50,
        label: 'data(name)',
        shape: 'roundrectangle',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': 'black',
        'target-arrow-color': 'black',
        'target-arrow-shape': 'triangle',
        'curve-style': 'unbundled-bezier',
        'control-point-distances': [15, -15],
        'control-point-weights': [0.2, 0.8],
      },
    },
  ]

  export default styles