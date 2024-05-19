import sys
import json
import pandapipes as pp
import numpy as np


def process_data(data):
    net = pp.create_empty_network(fluid=data['generalData']['fluid']['name_pp'])
    junction_indices = {}
    for junction in data['components']['junctions']:
        junction_idx = pp.create_junction(net, pn_bar=float(junction['init_pressure']) if junction['init_pressure'] else 1.05, 
                                          tfluid_k=293.15, name=junction['name'])
        junction_indices[junction['id']] = junction_idx
        junction['result_id'] = junction_idx

    
  
    for ext_grid in data['components']['ext_grids']:
        ext_grid_id = pp.create_ext_grid(net, junction=junction_indices[ext_grid['to_junction'][0]], 
                           p_bar=float(ext_grid['pressure']), t_k=293.15, name=ext_grid['name'])
        ext_grid['result_id'] = ext_grid_id
        
        
    for source in data['components']['sources']:
        source_id = pp.create_source(net, junction=junction_indices[source['to_junction'][0]], 
                         mdot_kg_per_s=float(source['mdot_kg_per_s']) if source['mdot_kg_per_s'] else 0,
                         scaling = float(source['scaling']) if source['scaling'] else 1,
                         name=source['name'])
        source['result_id'] = source_id
    
    for pump in data['components']['pumps']:
        pump_id = pp.create_pump(net, 
                       from_junction=junction_indices[pump['start_junction']],
                       to_junction=junction_indices[pump['end_junction']],
                       in_service=True,
                       name=pump['name'],
                       std_type=pump['type']) if pump['type'] else "P1"
        pump['result_id'] = pump_id

    for sink in data['components']['sinks']:
        sink_id = pp.create_sink(net, junction=junction_indices[sink['to_junction'][0]], 
                       mdot_kg_per_s=float(sink['mdot_kg_per_s']) if sink['mdot_kg_per_s'] else 0,
                       scaling = float(sink['scaling']) if sink['scaling'] else 1,
                       name=sink['name'])
        sink['result_id'] = sink_id

    for pipe in data['components']['pipes']:
        pipe_id = pp.create_pipe_from_parameters(
            net, 
            from_junction=junction_indices[pipe['startId']], 
            to_junction=junction_indices[pipe['endId']], 
            length_km=float(pipe['length']), 
            diameter_m=float(pipe['diameter']),
            loss_coefficient=float(pipe['loss_coefficient']) if pipe['loss_coefficient'] else 0,
            alpha_w_per_m2k=float(pipe['alpha_w_per_m2k']) if pipe['alpha_w_per_m2k'] else 0,
            qext_w=float(pipe['qext_w']) if pipe['qext_w'] else 0,
            k_mm=float(data['generalData']['roughness']), 
            name=f"pipe ({pipe['startName']} --> {pipe['endName']})"
        )
        pipe['result_id'] = pipe_id

    pp.pipeflow(net)


    # Extract results and update each component with its respective results
    for pipe in data['components']['pipes']:
        results = net.res_pipe.loc[pipe['result_id']]

        
        pipe['results'] = {
            'velocity_mean': round(results['v_mean_m_per_s'],4),
            'pressure_from': round(results['p_from_bar'],4),
            'pressure_to': round(results['p_to_bar'],4),
            'temperature_from': round(results['t_from_k'],4),
            'temperature_to': round(results['t_to_k'],4),
            'mass_flow_from': round(results['mdot_from_kg_per_s'],4),
            'mass_flow_to': round(results['mdot_to_kg_per_s'],4),
            'volume_flow_norm': round(results['vdot_norm_m3_per_s'],4),
            'reynolds_number': round(results['reynolds'],4),
            'friction_factor': round(results['lambda'],4)
        }
    
    for junction in data['components']['junctions']:
        results = net.res_junction.loc[junction['result_id']]
        junction['results'] = {
            'p_bar': round(results['p_bar'],4),
            't_k':round(results['t_k'],4)
        }

    for ext_grid in data['components']['ext_grids']:
        results = net.res_ext_grid.loc[ext_grid['result_id']]
        ext_grid['results'] = {
            'mdot_kg_per_s': round(results['mdot_kg_per_s'],4)
        }

    for source in data['components']['sources']:
        results = net.res_source.loc[source['result_id']]
        source['results'] = {
            'mass_flow': round(results['mdot_kg_per_s'],4)
        }

    for pump in data['components']['pumps']:
        results = net.res_pump.loc[pump['result_id']]
        pump['results'] = {
            'pressure_lift': round(results['deltap_bar'],4)
        }

    for sink in data['components']['sinks']:
        results = net.res_sink.loc[sink['result_id']]
        sink['results'] = {
            'mass_flow': round(results['mdot_kg_per_s'],4)
        }

    return data

    # Извлекаем результаты


def json_serializable(data):
    if isinstance(data, np.int64):
        return int(data)  # Преобразование np.int64 в стандартный int
    raise TypeError(f"Type {type(data)} not serializable")

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        processed_data = process_data(input_data)
        print(json.dumps(processed_data,ensure_ascii=False, default=json_serializable))
    except Exception as e:
        sys.stderr.write(f"Python error: {e}")
        sys.exit(1) 
        
     