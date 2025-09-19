importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyASo-Yln7M5dnejdbj6VBb8TbSNEhLxgMI",
  authDomain: "project-1-d169a.firebaseapp.com",
  projectId: "project-1-d169a",
  storageBucket: "project-1-d169a.firebasestorage.app",
  messagingSenderId: "966622567055",
  appId: "1:966622567055:web:1bfa064ca3ffcca9dcaefa",
  measurementId: "G-QX2LTS96XT",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((req) => {
  console.log("[firebase-messaging-sw.js] Received background message ", req);

  const notificationTitle = req.notification.title;
  const notificationOptions = {
    body: req.notification.body,
    icon: "/hello.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
