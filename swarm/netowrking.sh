#!/bin/sh

# usage: networking.sh ip
# will open all the network port to access/administrate our docker-birthday app and infrastructure

IP=$1

cs createSecurityGroup name="swarm"
cs createSecurityGroup name="overlord"

cs authorizeSecurityGroupIngress protocol=TCP startPort=22 endPort=22 securityGroupName=overlord cidrList=0.0.0.0/0
cs authorizeSecurityGroupIngress protocol=TCP startPort=2376 endPort=2376 securityGroupName=overlord cidrList=0.0.0.0/0
cs authorizeSecurityGroupIngress protocol=TCP startPort=3376 endPort=3376 securityGroupName=overlord cidrList=0.0.0.0/0

cs authorizeSecurityGroupIngress protocol=TCP startPort=22 endPort=22 securityGroupName=swarm cidrList=0.0.0.0/0
cs authorizeSecurityGroupIngress protocol=TCP startPort=2376 endPort=2376 securityGroupName=swarm cidrList=0.0.0.0/0
cs authorizeSecurityGroupIngress protocol=TCP startPort=3376 endPort=3376 securityGroupName=swarm cidrList=0.0.0.0/0

cs authorizeSecurityGroupIngress protocol=TCP startPort=0 endPort=65535 securityGroupName=swarm 'usersecuritygrouplist[0].account'=$EXOSCALE_ACCOUNT_EMAIL 'usersecuritygrouplist[0].group'=swarm
cs authorizeSecurityGroupIngress protocol=UDP startPort=0 endPort=65535 securityGroupName=swarm 'usersecuritygrouplist[0].account'=$EXOSCALE_ACCOUNT_EMAIL 'usersecuritygrouplist[0].group'=swarm

# from swarm to overlord > consul / elk
cs authorizeSecurityGroupIngress protocol=UDP startPort=5000 endPort=5000 securityGroupName=overlord 'usersecuritygrouplist[0].account'=$EXOSCALE_ACCOUNT_EMAIL 'usersecuritygrouplist[0].group'=swarm
cs authorizeSecurityGroupIngress protocol=TCP startPort=8500 endPort=8500 securityGroupName=overlord 'usersecuritygrouplist[0].account'=$EXOSCALE_ACCOUNT_EMAIL 'usersecuritygrouplist[0].group'=swarm

# from promotheus to swarm for monitoring purposes

# to swarm
cs authorizeSecurityGroupIngress protocol=TCP startPort=80 endPort=80 securityGroupName=swarm cidrList=0.0.0.0/32
cs authorizeSecurityGroupIngress protocol=TCP startPort=5000 endPort=5001 securityGroupName=swarm cidrList=0.0.0.0/32

# admin to overlord > consul
cs authorizeSecurityGroupIngress protocol=TCP startPort=8500 endPort=8500 securityGroupName=overlord cidrList=$IP/32
# admin to overlord > kibana
cs authorizeSecurityGroupIngress protocol=TCP startPort=5600 endPort=5600 securityGroupName=overlord cidrList=$IP/32
