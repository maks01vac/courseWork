import React, { useState, useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import cyContextMenu from 'cytoscape-context-menus';
import 'cytoscape-context-menus/cytoscape-context-menus.css';
import './style/calc.css';

const Calc = () => {
  const nameNodeRef = useRef(1);
  const cyRef = useRef(null);

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
      }
    });

    cy.on('dblclick', 'edge', function (event) {
      cy.remove(this);
    });

    cy.contextMenus({
      menuItems: [
        {
          id: 'remove',
          content: 'Remove',
          selector: 'node',
          onClickFunction: function (event) {
            const node = event.target;
            node.remove();
          },
        },
        {
          id: 'connect',
          content: 'Connect',
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

  return <div className='cy' ref={cyRef} style={{ height: '500px', width: '500px', background: '#333', margin: '10px'}} />;
};

export default Calc;