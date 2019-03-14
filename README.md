# Node.js Express API with TypeScript

> Node.js Express API with TypeScript. Supports MongoDB

## Description
This generator will help you to build your own Node.js Express Mongodb API using TypeScript.

### Project Introduction
- suppot ES6/ES7 features
- using tslint followed [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Installation

First, install [Yeoman](http://yeoman.io) and generator-node-express-typescript-api using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-node-express-typescript-api
```

Generate your new project:

```bash
yo node-express-typescript-api
```

## Running the API
### Development
To start the application in development mode, run:

```bash
npm install -g nodemon
npm install -g ts-node
npm install -g typescript
npm install
```


## Start the application in dev env:
```
nodemon
```

## Compile and run application:
javascript build application will be on new folder build
```
npm run server
```

## Compile application:
```
npm run build
```

## Start build application:
```
npm start
```


## Start the application in production env:

Install ts pm2 and typescript compiler:
```
npm install -g pm2
pm2 install typescript
```

example start with scale on 2 core:
```
pm2 start ./src/index.ts -i 1 \
    && sleep 1 \
    && pm2 scale index 2 --no-daemon
```

Express server listening on http://localhost:3000/, in development mode
The developer mode will watch your changes then will transpile the TypeScript code and re-run the node application automatically.
