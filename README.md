# MYT Gateway

MYT Gateway is... the gateway to our application based on [Ts.ED](https://tsed.io). This server will give you access to the microservices framework that is powering MYT.

## Getting started
### Requirements
- [Docker (Desktop)](https://www.docker.com/get-started)
- [Node](https://nodejs.org/en/) & NPM

### Development Setup
1. Clone this project using the following command:
   ```bash
   $ git clone --recurse-submodules -j8 git@git.ti.howest.be:TI/2021-2022/s5/trending-topics/projects/hybrid-work1/gateway.git
   ```
   > :bulb: Notice the `--recurse-submodules`? This is **super important**, because it will also fetch the needed submodules.
2. Run npm install:
   ```bash
   $ npm install
   ```
3. Copy the `.env.example` file, rename it to `.env` and fill it in according to the [`.env` configuration section](#env-configuration-file)
3. Now, run the following command:
   ```bash
   $ npm run start
   ```
   > ⏱ This will take a while the first time. Go grab a ☕ while waiting.

✅ **Done!** Normally the application should be available on `localhost:<TSED_PORT>` and should be able to contact other services.

### Pulling & building new services
If a new code is pushed to the main branch of any of the microservices, you'll need to update the code manually. Don't worry, just run the following command:

```bash
$ npm run rebuild
```

It will do all things necessary to get you up to speed with the application.
  > ⏱ This will take a while. Go grab a ☕ while waiting .

## Available commands
### Preferred command
- **`npm run start:dev`**:

  Start a fully **containerized** development server **with** hot-reloading capabilities.

### Run app code locally
- **`npm run start:local`**
  
  Start a development server without any hot-reloading capabilities, where **the app is runned locally**, but the needed containers are started.

### Plain commands
- **`npm run start:plain`**
  
  Starts a development server without any hot-reloading capabilities, **without any of the necessary containers.** 

- **`npm run start:plain:prod`**
  
  Starts a production-ready server, **without any of the necessary containers.** 

### Refresh & Rebuild commands
- **`npm run rebuild`**
  > ⏱ This will take a while. Go grab a ☕ while waiting .

  Will do the following things:
  - Fast-forward all submodules to the latest commit on master.
  - Take all existing down & destroy them
  - Rebuild the needed images for them with the new code that has been received
  - Bring these containers back online and ready for development

## Going Production
> TODO
# Miscellaneous
## `.env` configuration.
> :bulb: A `.env.example` is available. Copy it & rename it to `.env` to get started

|Key|Value explanation|Required?|Value example|
|---|---|---|---|
|COMPOSE_PROJECT_NAME|The name of the Docker-Stack|✖|MYT_Backend|
|RABBITMQ_PORT|The port used by RabbitMQ|✔|5672|
|RABBITMQ_MANAGEMENT_PORT|The port used by the RabbitMQ Adminstration Panel|✔|15672|
|MONGO_ROOT_USERNAME|The name of the root user of the database|✔|root|
|MONGO_ROOT_PASSWORD|The password of the root user of the MongoDB|✔|zXnpa&VDpoj6RU|
|MONGO_INITDB_DATABASE|The name of the database being used|✔|MYT|
|MONGO_PORT|The port used by MongoDB|✔|27017|
|TSED_PORT|The port used by TS.ed|✔|8080|
|NESTJS_PORT|The port used by Nest.JS|✖|3000|
|WARP_PORT|The port used by WARP|✖|3030|
|BACK_END_ENDPOINT|The endpoint used for contacting the back-end|✖|localhost|
|AUTOMATION_API_ENDPOINT|The endpoint used for contacting the Automation API|✖|localhost|
