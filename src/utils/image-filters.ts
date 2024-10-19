import { BadRequestException } from '@nestjs/common';

export const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!file) return callback(new BadRequestException('File is missing'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    return callback(null, true);
  }

  return callback(
    new BadRequestException(
      `The file extension .${fileExtension} is not allowed, valid extensions are [${validExtensions}]`,
    ),
    false,
  );
};
