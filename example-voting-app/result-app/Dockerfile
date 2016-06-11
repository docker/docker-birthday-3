FROM mhart/alpine-node:5.11.0

WORKDIR /app

ADD package.json /app/package.json
RUN npm config set registry http://registry.npmjs.org
RUN npm install && npm ls
RUN mv /app/node_modules /node_modules

ADD . /app

ENV PORT 5001
EXPOSE 5001

CMD ["node", "server.js"]
