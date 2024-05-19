const setupContextMenu = (cy, setPipeModelInfo, resetPipeModelInfo, setValidateGraph) => {
    cy.contextMenus({
      menuItems: [
        {
          id: 'delete-all-nodes',
          content: 'Удалить все точки',
          tooltipText: 'Удалить все точки',
          selector: 'node',
          onClickFunction: () => {
            cy.elements().remove();
            setValidateGraph(false);
            resetPipeModelInfo()
          }
        },
        {
          id: 'remove',
          content: 'Удалить',
          selector: 'node',
          onClickFunction: function (event) {
            const node = event.target;
            node.remove();
            const nodeId = node.id();
            setPipeModelInfo((prev) => ({
              ...prev,
              allNodes: prev.allNodes.filter((n) => n.data.id !== nodeId),
              linksInfo: prev.linksInfo.filter((link) => link.startId !== nodeId && link.endId !== nodeId),
            }));
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
              };
              setPipeModelInfo((prev) => ({
                ...prev,
                linksInfo: [...prev.linksInfo, edgeInfo],
              }));
            });
          },
        },
      ],
    });
  }
  
  export default setupContextMenu;