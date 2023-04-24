import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import cyContextMenu from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import './style/PipeGraphModel.css';

const PipeGraphModel = () => {
  const nameNodeRef = useRef(1);
  const cyRef = useRef(null);
  const degreeNodes =useRef([]);
  useEffect(() => {
    const cy = cytoscape({
      container: cyRef.current,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(name)',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
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

    
    cyContextMenu(cytoscape, cy);

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
        
        cy.nodes().forEach((node) => {
          const connectedEdges = node.connectedEdges();
        
          if (connectedEdges.length === 1) {
            const edge = connectedEdges[0];
            const source = edge.source();
            const target = edge.target();
        
            const connectedNode = source.id() === node.id() ? target : source;
        
            const data = {
              id: node.id(),
              name: node.data('name'),
              connectedNodeId: connectedNode.id(),
              connectedNodeName: connectedNode.data('name'),
            };
        
            // Добавить данные в массив
            degreeNodes.current.push(data);
          }
        });
        console.log(degreeNodes.current)
      }
    });

    cy.on('dblclick', 'edge', function (event) {
      cy.remove(this);
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