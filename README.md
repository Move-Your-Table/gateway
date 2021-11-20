# MYT Gateway

MYT Gateway is... the gateway to our application based on [Ts.ED](https://tsed.io). This server will give you access to the microservices framework that is powering MYT.

## Getting started
> ⚠ **SUPER IMPORTANT** ⚠
>
> If you have used & spin up any docker container of [Backend](https://git.ti.howest.be/TI/2021-2022/s5/trending-topics/projects/hybrid-work1/back-end) or [Automate API](https://git.ti.howest.be/TI/2021-2022/s5/trending-topics/projects/hybrid-work1/automateapi), please remove these and delete their images. 
> Currently, if you try to build these images, Docker will not be able to fulfill this request & crash. 
### Requirements
- [Docker (Desktop)](https://www.docker.com/get-started)
- [Node](https://nodejs.org/en/) & NPM

## Build setup

> **Important!** Ts.ED requires Node >= 10, Express >= 4 and TypeScript >= 3.

```batch
# install dependencies
$ yarn install

# serve
$ yarn start

# build for production
$ yarn build
$ yarn start:prod
```
