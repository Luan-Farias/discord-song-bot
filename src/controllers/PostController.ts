import { Request, Response } from 'express';
import Post from '@database/models/Post';

class PostController {
    public async index(request: Request, response: Response): Promise<Response> {
        const posts = await Post.find();

        return response.json(posts);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { originalname: name, size,  } = request.file;
        const { key } = request.body;

        const url = `${process.env.BASE_URL}/uploads/${key}`;

        const post = await Post.create({
            name,
            size,
            key,
            url,
        });

        return response.json(post);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const post = await Post.findById(request.params.id);

        await post.remove();

        return response.send();
    }
}

export default PostController;
