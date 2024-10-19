import { Module } from '@nestjs/common';

import { StorageService } from './storage.service';
import { FirebaseConfig } from '../../shared/context/firebase.service';

@Module({
  providers: [StorageService, FirebaseConfig],
  exports: [StorageService],
})
export class StorageModule {}
