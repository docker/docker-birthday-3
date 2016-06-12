#!/bin/sh

# Number of nodes in addition to the master one
export N_HATCHERIES=2

# Some colors
blue=$(tput setaf 6)
green=$(tput setaf 2)
red=$(tput setaf 1)
normal=$(tput sgr0)

# Overlord
printf "%s\n" "${green}Creating the overlord watching on our swarm ${normal}"
docker-machine create --driver exoscale \
        --exoscale-api-key $CLOUDSTACK_KEY \
        --exoscale-api-secret-key $CLOUDSTACK_SECRET_KEY \
        --exoscale-instance-profile small \
        --exoscale-disk-size 10 \
        --exoscale-security-group overlord \
        overlord || { printf "%s\n" "${red}'Machine creation failed :-/ Doing nothing'${normal}" ; exit 1; }

# Let's run consul
printf "%s\n" "${green}Running consul${normal}"
docker $(docker-machine config overlord) run --name consul \
    --restart=always  \
    -p 8500:8500 \
    -h consul \
    -d progrium/consul -server -bootstrap -ui-dir /ui || { printf "%s\n" "${red}'consul start failed :-/ (Is it already running ?) Doing nothing'${normal}" ; exit 1; }

printf "%s\n" "${blue}consul service running${normal}"

printf "%s\n" "${green}Copying elk and promotheus configuration files${normal}"
docker-machine scp -r elk/conf-files/ overlord:
docker-machine scp -r prometheus/config/ overlord:

printf "%s\n" "${blue}Overlord online${normal}"

#Deploy the queen of our swarm, the node which act as primary swarm master, scheduling our container on the hatcheries

printf "%s\n" "${green}Creating the queen of our swarm (swarm master)${normal}"
docker-machine create --driver exoscale \
        --exoscale-api-key $CLOUDSTACK_KEY \
        --exoscale-api-secret-key $CLOUDSTACK_SECRET_KEY \
        --exoscale-instance-profile small \
        --exoscale-disk-size 10 \
        --exoscale-security-group swarm \
        --swarm \
        --swarm-master \
        --swarm-discovery="consul://$(docker-machine ip overlord):8500" \
        --engine-opt="cluster-store=consul://$(docker-machine ip overlord):8500" \
        --engine-opt="cluster-advertise=eth0:2376" \
        --engine-label="type=lb" \
        swarm-queen || { printf "%s\n" "${red}'Machine creation failed :-/ Doing nothing'${normal}" ;  exit 1; }
printf "%s\n" "${blue}Queen online${normal}"



printf "%s\n" "${green}Running cadvisor to monitor the queen${normal}"
docker $(docker-machine config swarm-queen) run -d \
      -p 8888:8080 \
      --name=cadvisor-queen \
      --restart=always \
      --volume=/var/run/docker.sock:/tmp/docker.sock \
      --volume=/:/rootfs:ro \
      --volume=/var/run:/var/run:rw \
      --volume=/sys:/sys:ro \
      --volume=/var/lib/docker/:/var/lib/docker:ro \
      google/cadvisor:latest &> /dev/null || { printf "%s\n" "${red}'cadvisor start failed :-/ (Is it already running ?) Doing nothing'${normal}" ;  exit 1; }

printf "%s\n" "${blue}Cadvisor online${normal}"

printf "%s\n" "${green}Running registrator to communicate containers states to the overlord service discovery${normal}"
docker $(docker-machine config swarm-queen) run -d \
    --name=registrator-queen \
    --restart=always \
    --volume=/var/run/docker.sock:/tmp/docker.sock \
    -h registrator \
    kidibox/registrator \
    -internal consul://$(docker-machine ip overlord):8500 &> /dev/null
printf "%s\n" "${blue}Registrator launched${normal}"

# Deploy the cluster hatcheries, aka the cluster nodes

function create_hatchery() {
    printf "%s\n" "${green}Adding on an hatch to our swarm (swarm node)${normal}"
    docker-machine create --driver exoscale \
        --exoscale-api-key $CLOUDSTACK_KEY \
        --exoscale-api-secret-key $CLOUDSTACK_SECRET_KEY \
        --exoscale-instance-profile small \
        --exoscale-disk-size 10 \
        --exoscale-security-group swarm \
        --swarm \
        --swarm-discovery="consul://$(docker-machine ip overlord):8500" \
        --engine-opt="cluster-store=consul://$(docker-machine ip overlord):8500" \
        --engine-opt="cluster-advertise=eth0:2376" \
        --engine-label="type=node" \
        "$1" || { printf "%s\n" "${red}'No machine created (probably already exists)'${normal}" ; return 1; }
    printf "%s\n" "${blue}Hatch online${normal}"

    printf "%s\n" "${green}Running cadvisor to monitor this hatch${normal}"
    docker $(docker-machine config $1) run -d \
        -p 8888:8080 \
        --name=cadvisor-hatch-$1 \
        --restart=always \
        --volume=/var/run/docker.sock:/tmp/docker.sock \
        --volume=/:/rootfs:ro \
        --volume=/var/run:/var/run:rw \
        --volume=/sys:/sys:ro \
        --volume=/var/lib/docker/:/var/lib/docker:ro \
        google/cadvisor:latest &> /dev/null
    printf "%s\n" "${blue}Cadvisor launched${normal}"

    printf "%s\n" "${green}Running registrator to communicate containers states to the overlord service discovery${normal}"
    docker $(docker-machine config $1) run -d \
        --name=registrator-$1 \
        --restart=always \
        --volume=/var/run/docker.sock:/tmp/docker.sock \
        -h registrator \
        kidibox/registrator \
        -internal consul://$(docker-machine ip overlord):8500 &> /dev/null
    printf "%s\n" "${blue}Registrator launched${normal}"

}

#Then create swarm hatcheries

for i in $(seq 1 "$N_HATCHERIES"); do
    hatch_name="swarm-hatch-$i"
    create_hatchery "$hatch_name"
done

export IP_OVERLORD=$(docker-machine ip overlord)

# sleep 15

printf "%s\n" "${green}Swarm state${normal}"
docker $(docker-machine config --swarm swarm-queen) info
