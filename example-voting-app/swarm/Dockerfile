FROM ubuntu:14.04

MAINTAINER kiwenlau <kiwenlau@gmail.com>

WORKDIR /root

RUN apt-get update && apt-get install -y supervisor wget vim moreutils curl git

WORKDIR /root

# install docker
RUN wget -qO- https://get.docker.com/ | sh

# install etcd
RUN wget --no-check-certificate  https://github.com/coreos/etcd/releases/download/v2.2.4/etcd-v2.2.4-linux-amd64.tar.gz && \
    tar xzvf etcd-v2.2.4-linux-amd64.tar.gz && \
	cp etcd-v2.2.4-linux-amd64/etcd* /usr/local/bin && \
	rm -rf etcd-v2.2.4-linux-amd64.tar.gz etcd-v2.2.4-linux-amd64

# install swarm
RUN wget https://storage.googleapis.com/golang/go1.5.3.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.5.3.linux-amd64.tar.gz && \ 
    mkdir -p /root/work && \ 
    export GOPATH=/root/work && \
    export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin && \
    go get github.com/tools/godep && \ 
    go get github.com/golang/lint/golint && \ 
    wget https://github.com/docker/swarm/archive/v1.1.0.tar.gz && \ 
    tar -xzvf v1.1.0.tar.gz && \ 
    mkdir -p /root/work/src/github.com/docker/ && \ 
    mv swarm-1.1.0 /root/work/src/github.com/docker/swarm && \ 
    cd /root/work/src/github.com/docker/swarm && godep go install . && \ 
    mv /root/work/bin/swarm /usr/local/bin/swarm && \ 
    chmod +x /usr/local/bin/swarm && \ 
    rm -rf /root/*

ADD swarm-master.conf /etc/supervisor/conf.d/swarm-master.conf
ADD swarm-slave.conf /etc/supervisor/conf.d/swarm-slave.conf

EXPOSE 2379

VOLUME /var/lib/docker

# sudo docker build -t kiwenlau/swarm:1.1.0 .
