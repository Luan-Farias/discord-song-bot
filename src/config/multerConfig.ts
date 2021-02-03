import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const multerConfig: multer.Options = {
    dest: path.resolve(__dirname, '..', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', 'uploads'));
        },
        filename: (request, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err, file.filename);
                const key = `${hash.toString('hex')}-${file.originalname}`;
                request.body.key = key;
                request.body.originalfilename = file.originalname;

                cb(null, key);
            });
        },
    }),
    limits: {
        fileSize: 8 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'audio/mp4a-latmg',
            'audio/mpeg3',
            'audio/mpeg',
            'audio/x-mpeg-3',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
};

export default multerConfig;
