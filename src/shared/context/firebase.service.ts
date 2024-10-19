import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { config } from '../../config/envs.config';

@Injectable()
export class FirebaseConfig {
  constructor() {
    const firebaseConfig = {
      projectId: config.FIREBASE_PROJECT_ID,
      privateKey: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: config.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  }

  getStorage() {
    return admin.storage().bucket();
  }
}
