import getStartAndEndIdNodes from '../utils/getStartAndEndIdNodes';
import { useRef } from 'react'

import transformPipeModelInfo from '../utils/transformPipelineData';
const cytoscapeHandle = {}




cytoscapeHandle.handleTap = (cy, selectedElementType, setPipeModelInfo, getTypeRef) => (event) => {
    if (event.target === cy) {
        const ident = Date.now().toString();
        const typeRef = getTypeRef(selectedElementType.current.name_pp);
        const node = {
            group: 'nodes',
            data: { id: ident, type: selectedElementType.current.name_pp, name: `${selectedElementType.current.name_rus} ${typeRef.current}` },
            position: { x: event.position.x, y: event.position.y },
        };

        cy.add(node);
        typeRef.current += 1

        setPipeModelInfo((prev) => {
            const newNodesAndLinkInfo = {
                ...prev,
                allNodes: [...prev.allNodes, node],
            };
            // const transofmedData = transformPipeModelInfo(newNodesAndLinkInfo)

            return newNodesAndLinkInfo;
        });
    }
}

cytoscapeHandle.handleDblTap = (cy, setPipeModelInfo) => (event) => {
    // Получаем элемент, на котором было совершено действие
    const element = event.target;

    // Удаляем элемент из графа
    if (element !== cy && element.isEdge()) { // Проверяем, что элемент не является графом и это ребро
        element.remove();

        const idEdge = element.id();
        const [startId, endId] = getStartAndEndIdNodes(idEdge);

        setPipeModelInfo((prev) => {
            const newNodesAndLinkInfo = {
                ...prev,
                linksInfo: prev.linksInfo.filter(link => Number(link.startId) !== startId || Number(link.endId) !== endId),
            };
            return newNodesAndLinkInfo;
        });
    }
}


cytoscapeHandle.contextMenus = (cy, setPipeModelInfo, resetPipeModelInfo, setValidateGraph) => (event) => {
    return {
        menuItems: [
          {
            id: 'delete-all-nodes',
            content: 'Удалить все точки',
            tooltipText: 'Удалить все точки',
            selector: 'node',
            onClickFunction: () => {
              cy.elements().remove();
              resetPipeModelInfo()
              setValidateGraph(false)
            }
          },
          {
            id: 'remove',
            content: 'Удалить',
            selector: 'node',
            onClickFunction: function (event) {
              const node = event.target;
              node.remove();
              const nodeId = node.id()
              setPipeModelInfo((prev) => {
                const newNodesAndLinkInfo = {
                  ...prev,
                  allNodes: prev.allNodes.filter((n) => n.data.id != nodeId),
                  linksInfo: prev.linksInfo.filter(
                    (link) => link.startId != nodeId && link.endId != nodeId
                  ),
                };
                
                return newNodesAndLinkInfo;
              });
            },
          },
          {
            id: 'connect',
            content: 'Соединить',
            selector: 'node',
            onClickFunction: function (event) {
              const sourceNode = event.target;
              cy.one('tap', 'node', function (event) {
  
                const targetNode = event.target;
                const edgeId = `${sourceNode.id()}-${targetNode.id()}`;
                const edge = {
                  group: 'edges',
                  data: { id: edgeId, source: sourceNode.id(), target: targetNode.id() },
                };
                cy.add(edge);
  
                const edgeInfo = {
                  startId: sourceNode.id(),
                  startName: sourceNode.data('name'),
                  endId: targetNode.id(),
                  endName: targetNode.data('name'),
                }
                setPipeModelInfo((prev) => {
                  const newNodesAndLinkInfo = {
                    ...prev,
                    linksInfo: [...prev.linksInfo, edgeInfo],
                  };
                  return newNodesAndLinkInfo;
                });
              });
            },
          },
        ],
      }
}

export default cytoscapeHandle