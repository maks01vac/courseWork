import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import contextMenus from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import './style/PipeGraphModel.css';
import separatePointsByConnections from './separatePointsByConnections';
import getStartAndEndIdNodes from './getStartAndEndIdNodes';

const PipeGraphModel = ({pipeModelInfo,setPipeModelInfo}) => {
  const nodesAndLinkInfo = pipeModelInfo
  const nameNodeRef = useRef(1);
  const cyRef = useRef(null);


  useEffect(() => {
    cytoscape.use(contextMenus);
    const cy = cytoscape({
      container: cyRef.current,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#003366',
            label: 'data(name)',
            shape:'roundrectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 10,
            'line-color': '#b0c4de',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
          },
        },
      ],
      layout: {
        name: 'grid',
      },
      zoomingEnabled: false,
    });


    cy.on('tap', (event) => {
      if (event.target === cy) {
        const ident = Date.now().toString();
        const node = {
          group: 'nodes',
          data: { id: ident, name: nameNodeRef.current },
          position: { x: event.position.x, y: event.position.y },
        };

        cy.add(node);
        nameNodeRef.current += 1;

        setPipeModelInfo((prev) => {
          const newNodesAndLinkInfo = {
            ...prev,
            allNodes: [...prev.allNodes, node],
          };
          return newNodesAndLinkInfo;
        });
      }
      })
        
    cy.on('dblclick', 'edge', function (event) {
      cy.remove(this);

      const idEdge = event.target.id()
      const [startId, endId] = getStartAndEndIdNodes(idEdge)

      setPipeModelInfo((prev) => {
        const newNodesAndLinkInfo = {
          ...prev,
          linksInfo: prev.linksInfo.filter(link => link.startId !== startId && link.endId !== endId),
        };
        
        const singleOrMultiPointsInfo = separatePointsByConnections(newNodesAndLinkInfo.linksInfo);
    
        newNodesAndLinkInfo.singleConnectionNodes = singleOrMultiPointsInfo.singleConnectionPoints;
        newNodesAndLinkInfo.multiConnectionNodes = singleOrMultiPointsInfo.multipleConnectionPoints;
    
        return newNodesAndLinkInfo;
      });
    });

    cy.contextMenus({
      menuItems: [
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
                allNodes: prev.allNodes.filter((n) => n.data.id !== nodeId),
                linksInfo: prev.linksInfo.filter(
                  (link) => link.startId != nodeId && link.endId != nodeId
                ),
              };
              const singleOrMultiPointsInfo = separatePointsByConnections(newNodesAndLinkInfo.linksInfo);
              newNodesAndLinkInfo.singleConnectionNodes = singleOrMultiPointsInfo.singleConnectionPoints;
              newNodesAndLinkInfo.multiConnectionNodes = singleOrMultiPointsInfo.multipleConnectionPoints;
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
                startId:Number(sourceNode.id()),
                startName:sourceNode.data('name'),
                endId:Number(targetNode.id()),
                endName:targetNode.data('name'),
              }
              setPipeModelInfo((prev) => {
                const newNodesAndLinkInfo = {
                  ...prev,
                  linksInfo: [...prev.linksInfo, edgeInfo],
                };
                const singleOrMultiPointsInfo = separatePointsByConnections(newNodesAndLinkInfo.linksInfo);
                newNodesAndLinkInfo.singleConnectionNodes = singleOrMultiPointsInfo.singleConnectionPoints;
                newNodesAndLinkInfo.multiConnectionNodes = singleOrMultiPointsInfo.multipleConnectionPoints;
                return newNodesAndLinkInfo;
              });
            });
          },
        },
      ],
    });

    return () => {
      cy.destroy();
    };
  }, []);

  return <div className='cy' ref={cyRef}/>;
};

export default PipeGraphModel;

