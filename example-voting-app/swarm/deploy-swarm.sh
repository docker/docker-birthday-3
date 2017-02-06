#!/bin/bash

MASTER_IP=192.168.59.1
SLAVE_IP=(192.168.59.2 192.168.59.3)
INTERFACE=eth1

# delete all swarm containers on all nodes
echo -e "\ndelete all swarm containers on all nodes"
sudo docker -H tcp://$MASTER_IP:2375 rm -f swarm-master > /dev/null
for (( i = 0; i < ${#SLAVE_IP[@]}; i++ )); do
        sudo docker -H tcp://${SLAVE_IP[$i]}:2375 rm -f swarm-slave$i > /dev/null
done



# start swarm master container 
echo -e "\nstart swarm-master container on $MASTER_IP"
sudo docker -H tcp://$MASTER_IP:2375 run -it -d --net=host --privileged --name=swarm-master -e "INTERFACE=$INTERFACE" -e "DOCKER_HOST=tcp://0.0.0.0:2376" kiwenlau/swarm:1.1.0 supervisord --configuration=/etc/supervisor/conf.d/swarm-master.conf > /dev/null


# start swarm slave container
for (( i = 0; i < ${#SLAVE_IP[@]}; i++ )); do
        echo "start swarm-slave$i container on ${SLAVE_IP[$i]}"
        sudo docker -H tcp://${SLAVE_IP[$i]}:2375 run -v /var/lib/docker/aufs:/var/lib/docker/aufs -v /var/lib/docker/image:/var/lib/docker/image -it -d --net=host --privileged --name=swarm-slave$i -e "INTERFACE=$INTERFACE" -e "MASTER_IP=$MASTER_IP" kiwenlau/swarm:1.1.0 supervisord --configuration=/etc/supervisor/conf.d/swarm-slave.conf  > /dev/null
done



# check the status of swarm cluster
echo -e "\nchecking the status of swarm cluster, please wait..."
for (( i = 0; i < 120; i++ )); do
        docker_info=`sudo docker exec swarm-master docker info 2> /dev/null | grep -e "Nodes: ${#SLAVE_IP[@]}" -e "Status: Healthy"`
        if [[ $docker_info ]]; then
                echo -e "\nswarm is running"
                break
        fi
        sleep 1
done

echo ""
