FROM microsoft/node

RUN powershell -Command \
    Sleep 2; \
    wget -Uri https://github.com/StefanScherer/win-patch-iojs/releases/download/1.0.9/patchiojs.exe -OutFile patchiojs.exe -UseBasicParsing ; \
    patchiojs.exe 'C:/Program Files/nodejs/node.exe' ; \
    Remove-Item -Path patchiojs.exe

WORKDIR /app

ADD package.json /app/package.json
RUN npm install

ADD . /app

ENV PORT 80
#EXPOSE 80

CMD ["node", "server.js"]
