# docker-birthday swarm cluster

The goal is to run the birthday app on a swarm cluster with load-balancing using overlay networks.
The "disovery" machine will run in addition to a consul container, an ELK stack to collect logs from the application.
Living in switzerland I picked the excellent Exoscale as a service provider, but the script should be easily adapted to any provider supported by docker-machine.
A script is also available to run the cluster locally on a set of virtualbox.

# Requirements

Latest docker toolbox. Everything has been tested on version 1.10, but should work without issues on 1.11 also.

## cs

To interact with Exoscale cloudstack API we will use the [cs](https://github.com/exoscale/cs) command line tool:

    $ pip install cs

You will need to get your api keys from you Exoscale account (accessible from the exoscale dashboard in Account > Api Keys).
Then export those values in your shell:

    $ export EXOSCALE_ACCOUNT_EMAIL=<your exoscale mail>
    $ export CLOUDSTACK_KEY=<your exoscale api key>
    $ export CLOUDSTACK_SECRET_KEY=<your exoscale api secret key>
    $ export CLOUDSTACK_ENDPOINT=https://api.exoscale.ch/compute

# Create the swarm cluster

Create security groups and add the necessary rules in them with the following script:

    $ ./networking.sh <admin-public-ip>

Create a cluster using the script:

    $ ./create_swarm_on_exoscale.sh

The script will create 4 machines:

- 1 named overlord that will host a consul container and an optional ELK stack for logging purposes.
- 1 swarm master
- 2 swarm nodes

Administrate the cluster using your local docker client with (note the `--swarm`):

    $ eval $(docker-machine env --swarm swarm-queen)

You can check the status of your cluster at any time with:

    $ docker info

## Run the ELK stack on overlord machines

    $ cd elk
    $ eval $(docker-machine env overlord)
    $ docker-compose -f docker-compose-ubuntu.yml up -d

Once ELK is up you can now start the birthday with the alternate compose file and have all applications logs sent to the ELK stack on overlord:

    $ export IP_OVERLORD=$(docker-machine ip overlord)
    $ docker-compose -f ../../docker-compose-swarm-elk-logging.yml up -d

Navigate to http://$(docker-machine ip overlord):5600 to access kibana and view the app logs. (default l/p: admin/Kibana05)


## Scale the voting app

    $ docker-compose -f ../../docker-compose-swarm-elk-logging.yml scale voting-app=2

The excellent dockercloud-haproxy will modify its configuration accordingly:

    $ docker-compose -f ../../docker-compose-swarm-elk-logging.yml exec lb sh -c 'cat /haproxy.cfg'

    ```
    [...]
    backend default_service
    server examplevotingapp_voting-app_1 examplevotingapp_voting-app_1:80 check
    server examplevotingapp_voting-app_2 examplevotingapp_voting-app_2:80 check
    ```
