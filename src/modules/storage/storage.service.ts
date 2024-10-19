import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { FirebaseConfig } from 'src/shared/context/firebase.service';

@Injectable()
export class StorageService {
  constructor(private readonly firebaseService: FirebaseConfig) {}

  private logger = new Logger(StorageService.name);

  private baseUrl = 'https://storage.googleapis.com';

  async uploadImageToStorage(
    buffer: Buffer,
    fileName: string,
    mimetype: string,
  ) {
    try {
      const bucket = this.firebaseService.getStorage();
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(buffer, {
        metadata: {
          contentType: mimetype,
        },
      });

      await fileUpload.makePublic();
      const publicUrl = `${this.baseUrl}/${bucket.name}/${fileName}`;

      return publicUrl;
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('Error uploading image to storage');
    }
  }

  async deletedImageToStorage(fileName: string) {
    try {
      const bucket = this.firebaseService.getStorage();
      const file = bucket.file(fileName);
      await file.delete();
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('Error deleted image to storage');
    }
  }
}
