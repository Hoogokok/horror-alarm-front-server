self.addEventListener("install", function(e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function(e) {
  if (!e.data.json()) {
    console.log('push event data is not json');
    return;
  }
  const data = e.data.json().notification;
  if (data) {
    console.log('push event data:', data);
    const notificationTitle = data.title;
    const notificationOptions = {
      body: data.body,
      icon: ""
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
  //background showNotification
  const result = e.data.json().data;
  if (result) {
    console.log('push event data:', result);
    const notificationTitle = result.title;
    const notificationOptions = {
      body: result.body,
      icon: ""
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});


self.addEventListener("notificationclick", function(event) {
  console.log("notification click");
  const url = "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
