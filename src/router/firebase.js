import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Storage
const storage = getStorage(app)

// Test database connection
const testConnection = async () => {
  try {
    const testCollection = collection(db, '_test_connection')
    const testDoc = doc(testCollection, 'test')

    await setDoc(testDoc, {
      timestamp: new Date(),
      test: true
    })

    await deleteDoc(testDoc)
  } catch (error) {
    console.error('Failed to connect to Firebase:', error)
    throw error
  }
}

// Execute connection test
testConnection().catch(error => {
  console.error('Failed to connect to Firebase:', error)
})

export { auth, db, storage, signInWithEmailAndPassword }
