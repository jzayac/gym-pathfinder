import express from 'express';
import bodyParser from "body-parser";
import initServices from './initServices';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const services = initServices(console);

Object.values(services).map((service) => {
  app.use(service);
});

console.log('Hello world');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        port,
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;
