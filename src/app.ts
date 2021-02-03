import 'dotenv/config';
import Express from 'express';
import cors from 'cors';

import routes from './routes';

class App {
    public express: Express.Application
    public constructor() {
        this.express = Express();

        this.appVars();
        this.middlewares();
        this.routes();
    }

    private appVars() {
        this.express.set('port', process.env.PORT || 3333);
    }

    private middlewares() {
        this.express.use(cors());
        this.express.use(Express.json());
    }

    private routes() {
        this.express.use(routes);
    }
}

export default new App().express;
