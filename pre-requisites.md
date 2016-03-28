# Docker-Bday-Meetup
Pre-requisites for Docker B'Day Scalable app using Docker Swarm.

	- Self-based tutorials which cover basics of docker.<br>
	- Tutorials include building, shipping and running docker containers.<br>
	- Run and develop a cool simple micro-services app.<br>
	- Create your own version of the app and make it available in Docker Hub.<br>
	- Create Swarm cluster and run application on Docker Swarm. <br>
	- Scale Application with use of load balancer. <br>
	
1. Make sure to create an account in https://hub.docker.com/
2. Download and install Docker toolbox on your laptop.<br>
   For Windows Users: <br>
	Download link: https://github.com/docker/toolbox/releases/download/v1.10.3/DockerToolbox-1.10.3.exe <br>
	Installation instructions: https://docs.docker.com/windows/step_one/ <br>
   For MAC Users: <br>
	Download link: https://github.com/docker/toolbox/releases/download/v1.10.3/DockerToolbox-1.10.3.pkg <br>
	Installation instructions: https://docs.docker.com/mac/step_one/ <br>
   For Linux Users: <br>
	Install Docker Version 1.10.3  <br>
	https://docs.docker.com/engine/installation/linux/fedora/ <br>
	https://docs.docker.com/engine/installation/linux/ubuntulinux/ <br>
	Install Docker-compose version 1.6.2 <br>
	https://docs.docker.com/compose/install/ <br>
	Install git cli <br>
	https://git-scm.com/book/en/v2/Getting-Started-Installing-Git <br>
	Edit /etc/default/docker and add below line <br>
	DOCKER_OPTS="-H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock"
	$ sudo service docker restart
3. Once Docker toolbox is installed click on "Docker Quickstart Terminal", accept all the pop-up prompts until you get docker image and "$" prompt. For Linux users, login to system as root user. <br>
4. Install Docker swarm along with Consul Key-Value store. <br>
	https://docs.docker.com/swarm/install-manual/ <br>
	http://www.slideshare.net/venkatanageshdevarapalli/docker-clustering-meetup 
