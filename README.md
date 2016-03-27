# Docker Birthday #3 :tada: :birthday: :tada:

> Scalable and Secured Birthday App Project on Docker Swarm


Participants in the training will go through the steps involved in running and developing a simple voting app from a fresh computer using the Docker Toolbox. This simple app will include:

![birthday3-app-architecture](./docker-bday.jpg)

- **A Python webapp**: which lets you vote between several options
- **A Redis queue**: which collects new votes
- **A Java worker**: which consumes votes and stores them in…
- …**A Postgres database**: backed by a Docker volume
- **A Node.js webapp**: which shows the results of the voting in real time
- Load balancer to access voting and result applications
- All the services running on Docker swarm-cluster and scalable
There will be a self-paced beginners’ tutorial for attendees to learn Docker basics as they build and deploy this app locally. Experienced Docker users will serve as mentors to help beginners successfully complete the training.

### Pre-tutorial preparation
At the training, you will need to bring your own computer. Before you go to a birthday party training, there are some steps you should do some preparation to get your work environment ready. Here are the steps:

1. For Linux users, we need you to install [Docker engine] (https://docs.docker.com/engine/installation/) and [Docker compose] (https://docs.docker.com/compose/install/). Make sure you have Docker compose version 1.6 or higher by executing 

   ```docker-compose version```

1. For PC and Mac users we need you to install [Docker toolbox for Mac and Windows](https://www.docker.com/products/docker-toolbox) and use [Docker Machine] (https://docs.docker.com/machine/get-started/) to create a virtual machine to run your Docker containers. Once your machine is created and you have connected your shell to this new machine, you're ready to run Docker commands on this host.  If you're using Linux you can skip to the next step.
1. If you're new to Docker, pre-pull the docker images for the very basic tutorial

   ```bash
   docker pull hello-world
   docker pull alpine
   docker pull seqvence/static-site
```
1. To run the application and participate in the rest of the training, pre-pull these images

   ```bash
   docker pull mhart/alpine-node
   docker pull python:2.7-alpine
   docker pull manomarks/worker
   docker pull redis:alpine
   docker pull postgres:9.4
   ```
Install and configure Consul KV Store and Docker swarm.
And now you're ready. See you at the birthday party!


