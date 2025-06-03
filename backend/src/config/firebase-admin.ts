import { initializeApp, cert } from 'firebase-admin/app';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
  throw new Error('Missing Firebase service account credentials in environment variables');
}

initializeApp({
  credential: cert(serviceAccount),
});

console.log('Firebase Admin SDK initialized successfully');