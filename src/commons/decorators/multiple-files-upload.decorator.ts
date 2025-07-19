import { applyDecorators, Logger, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FileValidation } from '../filters/file-validation/file-validation.filter';
import { FileCleanupInterceptor } from '../interceptors/file-cleanup.interceptor';
import { CustomRequest } from '../interfaces/custom_request';
import { FileUploadOptions } from '../interfaces/file-upload-options';

export function MultipleFieldsUpload(fields: FileUploadOptions[]) {
  const interceptors = [];

  interceptors.push(createFilesInterceptor(fields));
  interceptors.push(FileCleanupInterceptor);

  return applyDecorators(UseInterceptors(...interceptors));
}

export function createFilesInterceptor(data: FileUploadOptions[]) {
  return FileFieldsInterceptor(
    data.map((field) => {
      return { name: field.fieldName, maxCount: 1 };
    }),
    {
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(
            null,
            process.cwd() +
              data.find((x) => x.fieldName === file.fieldname).filePathEnum,
          );
        },
        filename: function (req: CustomRequest, file, cb) {
          const uniqueSuffix =
            Date.now() +
            Math.round(Math.random() * 1e9) +
            '.' +
            file.mimetype.split('/')[1];
          const filePath = join(
            process.cwd(),
            data.find((x) => x.fieldName === file.fieldname).filePathEnum,
            uniqueSuffix,
          );
          if (!req.savedFiles) {
            req.savedFiles = [];
          }
          req.savedFiles.push(filePath);
          cb(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        try {
          const fileObject = data.find((x) => x.fieldName === file.fieldname);
          FileValidation(fileObject.fileType, file, callback);
          Logger.log('File is valid');
        } catch (error) {
          Logger.error(`File validation error: ${error.message}`);
          return callback(error, false);
        }
      },
    },
  );
}
