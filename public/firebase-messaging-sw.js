// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDVmgL41TdinddeFM2NpVOupZiwLYnD9EA",
  authDomain: "followmebet-bd47f.firebaseapp.com",
  projectId: "followmebet-bd47f",
  messagingSenderId: "910612835339",
  appId: "1:910612835339:web:edf2602152670ceb322b0e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/app-icon.png",
    badge: "/app-icon.png",
  });
});
