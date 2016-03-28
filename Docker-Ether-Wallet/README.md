# Docker-Ether-Wallet

Docker-Ether-Wallet is a docker version of MyEtherWallet. For easy to use and more secure, you can run an Ether wallet locally as a container. Be aware, stop and kill your container after you use your wallet. And write down your password and Ether Address on paper for better secure your wallet.

## Usage:

```
docker pull mingderwang/docker-ether-wallet
docker run -d -p 8000:8000 mingderwang/docker-ether-wallet 
```

or you can build it form Dockerfile

```
docker build -t docker-ether-wallet .
docker run -d -p 8000:8000 docker-ether-wallet 
```

then you can use any browser to surf http://localhost:8000 to create your first Ethereum account and transfer coins as well.

## About Ethereum:

Ethereum is the world computer, which can run smart contracts for you, and also is a second large market cap crypto-currency in the world, second to Bitcoin, only in 8 months after IPO on August 1, 2015.

Refer to [Ethereum](https://www.ethereum.org/) for more detail.



## About MyEtherWallet:

An open source, javascript, client-side tool for generating Ether Wallets and sending transactions. We created this after noticing users having immense trouble setting up the Ethereum client on their computers. We hope that it'll help accomplish day to day tasks without having a fully running client or dealing with command line.

Created by kvhnuke and tayvano.
Refer to [MyEtherWaller](https://www.myetherwallet.com/)
