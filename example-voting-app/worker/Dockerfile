FROM java:openjdk-8-jdk-alpine

ADD target/worker.jar worker.jar
RUN sh -c 'touch /worker.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/worker.jar"]
