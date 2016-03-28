FROM    centos:centos6
MAINTAINER ming@log4analytics.com

RUN yum install -y epel-release
RUN yum install -y nodejs npm
RUN yum install -y git
RUN npm install gulp -g

WORKDIR /etherwallet
RUN cd / && git clone https://github.com/kvhnuke/etherwallet.git
RUN npm install && \
    gulp &

EXPOSE  8000
ENTRYPOINT ["/usr/bin/python", "-m", "SimpleHTTPServer"]

# copyright belong to origin source code from https://github.com/kvhnuke/etherwallet
# docker repository on https://hub.docker.com/r/mingderwang/docker-ether-wallet/
