# Computational Modeling Workbench

A new React based web application for Computational Modeling.

## How to run

Make sure that you have `node.js` (<https://nodejs.org/>) installed.

From a shell in this directory (containing `package.json`), issue the following commands.

``` sh
npm run build
npm start
```

A server should start and say

``` txt
listening on port 3000
```

You can then open a web browser on <http://localhost:3000/cmwb> to open the application.

## Configuration

The base url configuration can be set in the files

- `./config.js`
- `./src/config/config.ts`

The port number can be set in:

- `./src/config/config.ts`

Note that on <cm.ics.ele.tue/nl> it should run on port 6000. On my Windows PC it does not run on port 6000, but it does on other ports.

### Python

- setup virtual environment as follows...

For the test version under 

``` sh
to do ...
```

