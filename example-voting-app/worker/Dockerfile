FROM windowsservercore:10.0.10586.0

RUN powershell -Command \
    Sleep 2; \
    iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1')); \
    choco install -y jdk7 -version 7.0.79.1 ; \
    rm C:\Windows\system32\java.exe ; \
    choco install -y maven

WORKDIR /code

ADD pom.xml /code/pom.xml
RUN ["mvn.cmd", "dependency:resolve"]
RUN ["mvn.cmd", "verify"]

# Adding source, compile and package into a fat jar
ADD src /code/src
RUN ["mvn.cmd", "package"]

#CMD ["/usr/lib/jvm/java-7-openjdk-amd64/bin/java", "-jar", "target/worker-jar-with-dependencies.jar"]
CMD ["java", "-jar", "target/worker-jar-with-dependencies.jar"]
