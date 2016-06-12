#!/bin/bash
docker build -t soleo/voting-load-tester . && \
docker run -ti --rm -v `pwd`:/code soleo/voting-load-tester