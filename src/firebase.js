
import { initializeApp} from 'firebase/app';
import { getFirestore, addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBeokXDCERLU5WQJnayOw4V8_DJMn8RxFk",
  authDomain: "pigeon-tournament.firebaseapp.com",
  projectId: "pigeon-tournament",
  storageBucket: "pigeon-tournament.appspot.com",
  messagingSenderId: "44804430435",
  appId: "1:44804430435:web:cec4ca8a9ee59c74967656"
};

const app = initializeApp(firebaseConfig);
let db = getFirestore(app);

export{db, addDoc, collection, getDocs, deleteDoc, doc, updateDoc}


