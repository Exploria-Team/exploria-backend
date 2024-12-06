import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage();

const bucket = storage.bucket('exploria-1');

export const uploadFile = (file: Express.Multer.File, userId: Number, folder: string) => {
  return new Promise<string>((resolve, reject) => {
    const fileName = `${folder}/${userId}_${Date.now()}_${uuidv4()}.${file.mimetype.split('/')[1]}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.end(file.buffer);
  });
};