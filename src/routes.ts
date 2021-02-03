import { Router } from 'express';
import PingController from '@controllers/PingController';
import PostController from '@controllers/PostController';
import multer from 'multer';
import multerConfig from '@config/multerConfig';

const routes = Router();

const pingController = new PingController();
const postController = new PostController();

routes.get('/ping', pingController.index);

routes.get('/posts', postController.index);
routes.post('/posts', multer(multerConfig).single('file'), postController.create);
routes.delete('/posts', postController.delete);

export default routes;
