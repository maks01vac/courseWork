function transformPipeModelInfo(pipeModelInfo) {
    const pipelineData = {
        ...pipeModelInfo,
        components: {
            junctions: [],
            pumps: [],
            sources: [],
            sinks: [],
            ext_grids: [],
            pipes: [],
            links: [...pipeModelInfo.linksInfo] // Links might already be set
        }
    };

    // Retrieve previous components
    const oldComponents = pipeModelInfo.components || {};
    const oldJunctions = oldComponents.junctions || [];
    const oldPumps = oldComponents.pumps || [];
    const oldSources = oldComponents.sources || [];
    const oldSinks = oldComponents.sinks || [];
    const oldExtGrids = oldComponents.ext_grids || [];
    const oldPipes = oldComponents.pipes || [];

    // Helper function to copy existing or provide default component
    function getExistingOrNew(oldArray, id, defaults) {
        const existing = oldArray.find(item => item.id === id);
        return existing ? { ...existing } : { ...defaults, id };
    }

    // Process all nodes to update components
    pipeModelInfo.allNodes.forEach((node) => {
        const { id, type, name, ...extraData } = node.data;
        const position = node.position;

        const baseComponent = {
            id, name, position, ...extraData
        };

        switch (type) {
            case 'junction':
                pipelineData.components.junctions.push(
                    getExistingOrNew(oldJunctions, id, { ...baseComponent, init_pressure: '', temperature: '' })
                );
                break;
            case 'pump':
                pipelineData.components.pumps.push(
                    getExistingOrNew(oldPumps, id, { ...baseComponent, start_junction: '', end_junction: '', type:'P1', mdot_flow_kg_per_s:'', p_flow_bar:''  })
                );
                break;
            case 'source':
                pipelineData.components.sources.push(
                    getExistingOrNew(oldSources, id, { ...baseComponent, mdot_kg_per_s: '', scaling: '', to_junction: [] })
                );
                break;
            case 'sink':
                pipelineData.components.sinks.push(
                    getExistingOrNew(oldSinks, id, { ...baseComponent, mdot_kg_per_s: '', scaling: '', to_junction: [] })
                );
                break;
            case 'external-grid':
                pipelineData.components.ext_grids.push(
                    getExistingOrNew(oldExtGrids, id, { ...baseComponent, pressure: '', to_junction: [] })
                );
                break;
            default:
                console.log(`Unknown type: ${type}`);
                break;
        }
    });

    const { junctions, links } = pipelineData.components;

    // Function to find pipes based on their `startId` and `endId`
    function findExistingPipe(oldPipes, startId, endId) {
        return oldPipes.find(pipe => 
            (pipe.startId === startId && pipe.endId === endId) || 
            (pipe.startId === endId && pipe.endId === startId)
        );
    }

    // Create pipes from `links`, retaining old data where possible
    const pipes = links.filter(link =>
        junctions.some(junction => junction.id === link.startId) &&
        junctions.some(junction => junction.id === link.endId)
    ).map(link => {
        const existingPipe = findExistingPipe(oldPipes, link.startId, link.endId);
        return existingPipe ? { ...existingPipe } : { ...link, diameter: '', length: '', loss_coefficient: '', alpha_w_per_m2k: '', qext_w: '' };
    });

    // Add pipes to components
    pipelineData.components.pipes = pipes;

    // Function to add connection information to components
    function addConnectionInfo(items, itemType) {
        items.forEach(item => {
            // Find connections between the component and junctions
            const connectionsToJunctions = links.filter(link =>
                (link.startId == item.id && junctions.some(junction => junction.id == link.endId)) ||
                (link.endId == item.id && junctions.some(junction => junction.id == link.startId))
            );

            // Add `to_junction` field if connections exist
            if (connectionsToJunctions.length > 0) {
                item.to_junction = connectionsToJunctions.map(link =>
                    link.startId == item.id ? link.endId : link.startId
                );
            }
        });
    }

    // Add pump connections
    const pumps = pipelineData.components.pumps;
    pumps.forEach(pump => {
        const pumpConnections = links.filter(link =>
            link.startId === pump.id || link.endId === pump.id
        );
        pumpConnections.forEach(link => {
            if (link.startId === pump.id) {
                pump.end_junction = link.endId;
            } else if (link.endId === pump.id) {
                pump.start_junction = link.startId;
            }
        });
    });

    // Apply `addConnectionInfo` to appropriate component types
    addConnectionInfo(pipelineData.components.ext_grids, 'external-grid');
    addConnectionInfo(pipelineData.components.sources, 'source');
    addConnectionInfo(pipelineData.components.sinks, 'sink');

    // Ensure `generalData` and fluid defaults are in place
    pipelineData.generalData = pipelineData.generalData || {};
    pipelineData.generalData.fluid = pipelineData.generalData.fluid || {
        name_rus: 'вода',
        name_pp: 'water'
    };
    pipelineData.generalData.roughness = pipelineData.generalData.roughness || '';

    return pipelineData;
}

export default transformPipeModelInfo;