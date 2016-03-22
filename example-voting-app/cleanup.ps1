docker kill $(docker ps -qa)
docker rm -vf $(docker ps -qa)
