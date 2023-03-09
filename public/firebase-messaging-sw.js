// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyABF4m8puuckAImYCAF5HRFsZ_03J609LQ",
  authDomain: "admin-panel-76a17.firebaseapp.com",
  databaseURL: "https://admin-panel-76a17-default-rtdb.firebaseio.com",
  projectId: "admin-panel-76a17",
  storageBucket: "admin-panel-76a17.appspot.com",
  messagingSenderId: "215078169100",
  appId: "1:215078169100:web:61f5a720a5ff127b645c29",
  measurementId: "G-7CXT51EQ6T"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
