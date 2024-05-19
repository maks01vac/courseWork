import pandapipes as pp

print(help('pandapipes.multinet.create_multinet'))

# #create empty net
# net = pp.create_empty_network(fluid="lgas")

# # create junction
# junction1 = pp.create_junction(net, pn_bar=1.0, tfluid_k=293.15,  name="Junction 1")
# junction2 = pp.create_junction(net, pn_bar=1.0, tfluid_k=293.15,  name="Junction 2")
# junction3 = pp.create_junction(net, pn_bar=1.0, tfluid_k=293.15,  name="Junction 3")
# junction4 = pp.create_junction(net, pn_bar=1.0, tfluid_k=293.15,  name="Junction 4")
# junction5 = pp.create_junction(net, pn_bar=1.0, tfluid_k=293.15,  name="Junction 5")

# medium_pressure_grid = pp.create_ext_grid(net, junction=junction5, p_bar=0.5, t_k=293.15, name="Grid Connection")

# pipe1 = pp.create_pipe_from_parameters(net, from_junction=junction1, to_junction=junction2, length_km=0.545, diameter_m=0.2,  name="Pipe 1")
# pipe2 = pp.create_pipe_from_parameters(net, from_junction=junction2, to_junction=junction3, length_km=0.095, diameter_m=0.15, name="Pipe 2")
# pipe3 = pp.create_pipe_from_parameters(net, from_junction=junction1, to_junction=junction4, length_km=0.285, diameter_m=0.15, name="Pipe 3")
# pipe4 = pp.create_pipe_from_parameters(net, from_junction=junction1, to_junction=junction5, length_km=0.43, diameter_m=0.15,  name="Pipe 4")


# sink = pp.create_sink(net, junction=junction4, mdot_kg_per_s=0.277, name="Sink 1")
# sink = pp.create_sink(net, junction=junction3, mdot_kg_per_s=0.139, name="Sink 2")



# pp.pipeflow(net)

# print(net.res_junction)
# print(net.res_pipe)