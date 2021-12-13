# MYT Gateway

MYT Gateway is... the gateway to our application based on [Ts.ED](https://tsed.io). This server will give you access to the microservices framework that is powering MYT.

## Getting started
### Requirements
- [Docker (Desktop)](https://www.docker.com/get-started)
- [Node](https://nodejs.org/en/) & NPM

### Development Setup
1. Clone this project using the following command:
   ```bash
   $ git clone git@git.ti.howest.be:TI/2021-2022/s5/trending-topics/projects/hybrid-work1/gateway.git
   ```
2. Run npm install:
   ```bash
   $ npm install
   ```
3. Copy the `.env.example` file, rename it to `.env` and fill it in according to the [`.env` configuration section](#env-configuration-file)
4. Now, run the following command:
   ```bash
   $ npm run start:container
   ```
   > ⏱ This will take a while the first time. Go grab a ☕ while waiting.

✅ **Done!** Normally the application should be available on `localhost:<TSED_PORT>` and should be able to contact other services.

#### Adding other services
Because [Gateway](https://git.ti.howest.be/TI/2021-2022/s5/trending-topics/projects/hybrid-work1/gateway), [Automation API](https://git.ti.howest.be/TI/2021-2022/s5/trending-topics/projects/hybrid-work1/automateapi) and [Back-End](https://git.ti.howest.be/TI/2021-2022/s5/trending-topics/projects/hybrid-work1/back-end) share the same custom network, you can build these and get the production server up & running.

- For [Back-End](https://git.ti.howest.be/TI/2021-2022/s5/trending-topics/projects/hybrid-work1/back-end), clone the project, navigate to the root of the project and perform the following command:
  ```bash
  $ docker-compose up rabbitmq_dev -d
  $ docker-compose up nestjs_staging -d
  ```
- For [Automation API](https://git.ti.howest.be/TI/2021-2022/s5/trending-topics/projects/hybrid-work1/automateapi), clone the project, navigate to the root of the project and perform the following command:
  ```bash
  $ docker-compose up rust_prod -d
  ```

## Available commands
|Command|Explication|
|---|---|
|`npm run start`|Starts a development server **locally**|
|`npm run start:prod`|Starts a production-ready server **locally**|
|||
|`npm run start:container`|Start a fully **containerized** development server **with** hot-reloading capabilities.|
|`start:container:prod`|Start a fully **containerized** production server|
  

# Miscellaneous
## `.env` configuration.
> :bulb: A `.env.example` is available. Copy it & rename it to `.env` to get started

|Key|Value explanation|Required for Development?|... Staging?|... Production?|Value example|
|---|---|---|---|---|---|
|COMPOSE_PROJECT_NAME|Name of the compose stack|✖|✖|✖|MYT Automate Server|
|||||||
|TSED_PORT|The port used to reach the application from external networks|✔|✔|✔|8080|
|AUTOMATE_ENDPOINT|The endpoint used by the application to reach the automate server|✔* </br> *\*If the code's running locally*|✖|✖|localhost|
|AUTOMATE_PORT|The port used by the application to reach the automate server|✔* </br> *\*If the code's running locally*|✖|✖|3000|
|BACKEND_ENDPOINT|The endpoint used by the application to reach the back-end server|✔* </br> *\*If the code's running locally*|✖|✖|localhost|
|BACKEND_PORT|The port used by the application to reach the back-end server|✔* </br> *\*If the code's running locally*|✖|✖|8080|
