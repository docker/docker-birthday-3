FROM java:openjdk-8-jdk-alpine

#RUN apt-get update -qq && apt-get install -y maven && apt-get clean

RUN apk update \
 && apk add bash \
 && bash

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

WORKDIR /usr/local/src/voting-app

ADD build.gradle /usr/local/src/voting-app
ADD gradle /usr/local/src/voting-app/gradle
ADD gradlew /usr/local/src/voting-app
ADD src /usr/local/src/voting-app/src

RUN ./gradlew build && mv build/libs/worker-1.0-SNAPSHOT.jar /usr/local/bin/worker.jar

ENTRYPOINT ["java", "-jar", "-Djava.security.egd=file:/dev/urandom", "/usr/local/bin/worker.jar"]
