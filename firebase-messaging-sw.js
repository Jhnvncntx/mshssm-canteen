// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyABLZMrwUItOZlIxWhU2iWB1exHGP-6Tts",
    authDomain: "canteen-notification-system.firebaseapp.com",
    projectId: "canteen-notification-system",
    storageBucket: "canteen-notification-system.appspot.com",
    messagingSenderId: "339382331892",
    appId: "1:339382331892:web:16d5cb933325bf848db1a1",
    measurementId: "G-DH9N1ZHLT6"
};

// Initialize the Firebase app
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that you can handle foreground messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.setBackgroundMessageHandler((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});