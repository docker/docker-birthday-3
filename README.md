# Docker Birthday #3 :tada: :birthday: :tada:

> Birthday App Project

### This simple app will include:

![birthday3-app-architecture](./tutorial-images/bd3-architecture.png)

- **A Python webapp**: which lets you vote between several options
- **A Redis queue**: which collects new votes
- **A Java worker**: which consumes votes and stores them in…
- …**A Postgres database**: backed by a Docker volume
- **A Node.js webapp**: which shows the results of the voting in real time

### How to use it

1. For Linux users, we need you to install [Docker engine] (https://docs.docker.com/engine/installation/) and [Docker compose] (https://docs.docker.com/compose/install/). Make sure you have Docker compose version 1.6 or higher by executing 

   ```docker-compose version```

2. For PC and Mac users we need you to install [Docker toolbox for Mac and Windows](https://www.docker.com/products/docker-toolbox) and use [Docker Machine] (https://docs.docker.com/machine/get-started/) to create a virtual machine to run your Docker containers. Once your machine is created and you have connected your shell to this new machine, you're ready to run Docker commands on this host.  If you're using Linux you can skip to the next step.

3. If you're new to Docker, pre-pull the docker images for the very basic tutorial

   ```bash
   docker pull hello-world
   docker pull alpine
   docker pull seqvence/static-site
```
4. To run the application and participate in the rest of the training, pre-pull these images

   ```bash
   docker pull mhart/alpine-node
   docker pull python:2.7-alpine
   docker pull manomarks/worker
   docker pull redis:alpine
   docker pull postgres:9.4
   ```
And now you're ready.

### Logging using ELK Stack
For the logging, we use ELK Stack. You can find ElasticSearch and Kibana service in etc/elk, and running it
with `docker-compose up -d`. For the logstash, which is the agent to collect the log I've added it as container in example-voting-app [docker-compose](https://github.com/HieronyM/docker-birthday-3/blob/master/example-voting-app/docker-compose.yml).
