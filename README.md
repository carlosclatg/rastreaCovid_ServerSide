# rastreaCovid_ServerSide
rastreaCovid

RUN:

From the folder containing package.json

$ npm install

$ node index.js 

To see the docs:

http://localhost:{PORT}/api/api-docs/

If you run it as it is:

http://localhost:8080/api/api-docs/

To run test:

$ npm test


Architecture:

The application is splitted into several layers:

- API layer --> This layer exposes some endpoints.
- Middlewares --> Retrieves data, for example the token, and unsign it to get the userId. At this time another middleware is used to log some entries in DB.
- Logic layer --> This layer checks the input data and manages the operations with the DB. This layer is the one automatically tested.
