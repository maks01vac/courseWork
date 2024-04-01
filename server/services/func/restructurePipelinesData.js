const separatePointsByConnections = require('./separatePointsByConnections')


const restructurePipelinesData =  function (data) {
    data.connections = data.connections.map((connection) => {
        return{
            startId: connection.startnodeid,
            startName: searhNodeName(connection.startnodeid, data.nodes),
            endId: connection.endnodeid,
            endName:searhNodeName(connection.endnodeid, data.nodes),
            length:connection.length,
            diameter: connection.diameter,
            flow_rate:connection.flowrate
        }
    })

    data.nodes = data.nodes.map((node) => {
        return {
            group: 'nodes',
            data: {
                id: node.nodeid,
                name: node.nodename
            },
            position: {
                x: node.positionx,
                y: node.positiony
            },
            initPressure: node.pressure,
            pressure: node.pressure
        }
    })
    const singleOrMultiPointsInfo = separatePointsByConnections(data.connections);

    const restructureData = {
        idPipe:data.pipelineid,
        userId: data.userid,
        generalData: {
            viscosity: data.viscosity,
            density: data.density,
            roughness: data.roughness
        },
        linksInfo:data.connections,
        multiConnectionNodes: singleOrMultiPointsInfo.multipleConnectionPoints,
        singleConnectionNodes: singleOrMultiPointsInfo.singleConnectionPoints,
        allNodes: data.nodes
    }
    return restructureData
}


function searhNodeName (id, nodes) {
    const node = nodes.find((node)=> node.nodeid == id)
    return node.nodename
}

module.exports = restructurePipelinesData