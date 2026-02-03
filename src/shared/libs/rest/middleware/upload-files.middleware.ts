import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import type { NextFunction, Request, Response } from 'express';
import type { Middleware } from './middleware.interface.js';

export class UploadFilesMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private maxCount?: number
  ) {}

  public execute(req: Request, res: Response, next: NextFunction) {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const uploadFilesMiddleware = multer({ storage })
      .array(this.fieldName, this.maxCount);

    uploadFilesMiddleware(req, res, next);
  }
}
