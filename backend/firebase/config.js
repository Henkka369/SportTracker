import * as firebase from 'firebase';
import '@firebase/auth';

const firebaseConfig = {
    // Firebase config comes here
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };