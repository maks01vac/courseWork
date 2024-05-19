const separatePointsByConnections = require('./separatePointsByConnections')


function transformNetworkData(response) {
    // Инициализация структуры JSON
    const transformed = {
        idPipe: '',
        allNodes: [],
        linksInfo: [],
        components: {
            junctions: [],
            pumps: [],
            sources: [],
            sinks: [],
            ext_grids: [],
            pipes: [],
            links: []
        },
        generalData: {
            fluid: {
                name_rus: response.pipeline.fluidnamerus,
                name_pp: response.pipeline.fluidnamepp
            },
            roughness: response.pipeline.roughness
        }
    };

    // Преобразуем узлы в allNodes
    response.nodes.forEach(node => {
        transformed.allNodes.push({
            group: 'nodes',
            data: {
                id: node.nodeid.toString(),
                type: node.nodetype,
                name: node.nodename
            },
            position: {
                x: node.positionx,
                y: node.positiony
            }
        });
    });

    // Преобразуем связи в linksInfo
    response.links.forEach(link => {
        transformed.linksInfo.push({
            startId: link.startnodeid.toString(),
            startName: response.nodes.find(n => n.nodeid === link.startnodeid).nodename,
            endId: link.endnodeid.toString(),
            endName: response.nodes.find(n => n.nodeid === link.endnodeid).nodename,
            diameter: link.diameter || '',
            length: link.length || '',
            loss_coefficient: link.losscCoefficient || '',
            alpha_w_per_m2k: link.alpha_w_per_m2k || '',
            qext_w: link.qext_w || ''
        });
    });

    // Преобразуем узлы в junctions
    response.junctions.forEach(junction => {
        const node = response.nodes.find(n => n.nodeid === junction.nodeid);
        transformed.components.junctions.push({
            id: node.nodeid.toString(),
            name: node.nodename,
            type: 'junction',
            position: {
                x: node.positionx,
                y: node.positiony
            },
            init_pressure: '',
            temperature: '',
            result_id: junction.junctionresultid,
            results: {
                p_bar: junction.pressure,
                t_k: junction.temperature
            }
        });
    });

    // Преобразуем насосы в pumps
    response.pumps.forEach(pump => {
        const node = response.nodes.find(n => n.nodeid === pump.nodeid);
        transformed.components.pumps.push({
            id: node.nodeid.toString(),
            name: node.nodename,
            type: 'pump',
            position: {
                x: node.positionx,
                y: node.positiony
            },
            start_junction: pump.startjunction.toString(),
            end_junction: pump.endjunction.toString(),
            result_id: pump.pumpresultid,
            results: {
                pressure_lift: pump.pressurelift
            }
        });
    });

    // Преобразуем источники в sources
    response.sources.forEach(source => {
        const node = response.nodes.find(n => n.nodeid === source.nodeid);
        transformed.components.sources.push({
            id: node.nodeid.toString(),
            name: node.nodename,
            type: 'source',
            position: {
                x: node.positionx,
                y: node.positiony
            },
            mdot_kg_per_s: source.massflow.toString(),
            scaling: source.scaling || '',
            to_junction: [source.tojunction.toString()],
            result_id: source.sourceid,
            results: {
                mass_flow: source.massflow
            }
        });
    });

    // Преобразуем стоки в sinks
    response.sinks.forEach(sink => {
        const node = response.nodes.find(n => n.nodeid === sink.nodeid);
        transformed.components.sinks.push({
            id: node.nodeid.toString(),
            name: node.nodename,
            type: 'sink',
            position: {
                x: node.positionx,
                y: node.positiony
            },
            mdot_kg_per_s: sink.massflow.toString(),
            scaling: sink.scaling || '',
            to_junction: [sink.tojunction.toString()],
            result_id: sink.sinkid,
            results: {
                mass_flow: sink.massflow
            }
        });
    });

    // Преобразуем внешние сети в ext_grids
    response.externalGrids.forEach(grid => {
        const node = response.nodes.find(n => n.nodeid === grid.nodeid);
        transformed.components.ext_grids.push({
            id: node.nodeid.toString(),
            name: node.nodename,
            type: 'external-grid',
            position: {
                x: node.positionx,
                y: node.positiony
            },
            pressure: grid.pressure.toString(),
            to_junction: [grid.tojunction.toString()],
            result_id: grid.gridresultid,
            results: {
                mdot_kg_per_s: grid.massflow
            }
        });
    });

    // Преобразуем трубы в pipes
    response.pipes.forEach(pipe => {
        transformed.components.pipes.push({
            startId: pipe.startnodeid.toString(),
            startName: response.nodes.find(n => n.nodeid === pipe.startnodeid).nodename,
            endId: pipe.endnodeid.toString(),
            endName: response.nodes.find(n => n.nodeid === pipe.endnodeid).nodename,
            diameter: pipe.diameter.toString(),
            length: pipe.length.toString(),
            loss_coefficient: pipe.losscCoefficient || '',
            alpha_w_per_m2k: pipe.alpha_w_per_m2k || '',
            qext_w: pipe.qext_w || '',
            result_id: pipe.resultid,
            results: {
                velocity_mean: pipe.velocitymean,
                pressure_from: pipe.pressurefrom,
                pressure_to: pipe.pressureto,
                temperature_from: pipe.temperaturefrom,
                temperature_to: pipe.temperatureto,
                mass_flow_from: pipe.massflowfrom,
                mass_flow_to: pipe.massflowto,
                volume_flow_norm: pipe.volumeflownorm,
                reynolds_number: pipe.reynoldsnumber,
                friction_factor: pipe.frictionfactor
            }
        });
    });

    // Возвращаем преобразованный объект
    return transformed;
}

module.exports = transformNetworkData