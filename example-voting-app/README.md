Example Voting App on Windows Server 2016 TP4
=============================================

This is an example Docker app with multiple services. It is run with Docker Compose, but does not use Docker Networking at the moment. It uses a small PowerShell helper script to connect containers together. You will need Docker Compose 1.6 or later.

Architecture
-----

* A Python webapp which lets you vote between two options
* A Redis queue which collects new votes
* A Java worker which consumes votes and stores them in…
* A Postgres database backed by a Docker volume
* A Node.js webapp which shows the results of the voting in real time

Running
-------

Run in this directory:

    $ docker-compose up -d

Now we have to link the containers with the following helper script. This must be called with administrator privileges as we have to open some ports in the Windows firewall.

    $ .\link.ps1

To open the two web pages run this command:

    $ .\browse.ps1

The app will be running on port 80 on your voting-app container, and the results will be on port 80 in result-app container.
