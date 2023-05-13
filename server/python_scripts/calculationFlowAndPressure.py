import sys
import json
import pandapipes as pp
import numpy as np



def process_data(data):
    allNodes = data["allNodes"]
    singleConnectionNodes = data["singleConnectionNodes"]
    linkInfo = data["linksInfo"]
    generalData = data["generalData"]
    numNodes = len(allNodes)
    maxPressure = max(float(node["pressure"]) for node in singleConnectionNodes)
    minPressure = min(float(node["pressure"]) for node in singleConnectionNodes)
    initialPressure = np.linspace(float(minPressure), maxPressure, numNodes)

    for i in range(len(allNodes)):
        allNodes[i]["initPressure"] = initialPressure[i]

    net = pp.create_empty_network(fluid='water')

    # Создаем свойство с постоянным значением
    pp.create_constant_property(net, "density", float(generalData["density"]))  # значение плотности задано равным (generalData['density']) кг/м3
    pp.create_constant_property(net, "viscosity", float(generalData["viscosity"]))  # значение вязкости задано равным 0.001 Па*с
    ppNodes = []
    for node in allNodes:
        junctionName = "junction{}".format(node["data"]["name"])
        pp.create_junction(net, pn_bar=node["initPressure"], tfluid_k=293.15, index=node["data"]["name"])
        ppNodes.append(node["data"]["name"])

    for link in linkInfo:
        pipeName = "pipe {} - {}".format(link["startName"], link["endName"])

        pp.create_pipe_from_parameters(net, from_junction=int(link['startName']), 
                                       to_junction=int(link["endName"]), length_km=float(link["length"]), 
                                       diameter_m=float(link["diameter"]), k_mm=float(generalData["roughness"]), 
                                       name=pipeName)
    for node in singleConnectionNodes:
        pp.create_ext_grid(net, junction=node["name"], p_bar=float(node["pressure"]), t_k=293.15)

    pp.pipeflow(net)

    junction_pressures = net.res_junction["p_bar"]
    pipe_flows = net.res_pipe["v_mean_m_per_s"]

    for i in range(len(allNodes)):
        isNotSingleConnectionNode = True

        for j in range(len(singleConnectionNodes)):
            if allNodes[i]["data"]["name"] == singleConnectionNodes[j]['name']:
                isNotSingleConnectionNode = False

        if isNotSingleConnectionNode:
            for node in data["multiConnectionNodes"]:
                if node["name"] == allNodes[i]["data"]["name"]:
                    node["pressure"] = junction_pressures[node["name"]]


    for i in range(len(data["linksInfo"])):
        data["linksInfo"][i]["flow_rate"] = pipe_flows[i]

    return data


if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        processed_data = process_data(input_data)
        print(json.dumps(processed_data))
    except Exception as e:
        sys.stderr.write(f"Python error: {e}")
        sys.exit(1) 
        
     