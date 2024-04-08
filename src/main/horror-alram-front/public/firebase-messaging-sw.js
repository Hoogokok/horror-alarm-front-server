self.addEventListener("install", function(e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  console.log("fcm sw activate..");
});



self.addEventListener("push", function(e) {
  console.log("push: ", e.data.json());
  if (!e.data.json()) return;

  const resultData = e.data.json().data;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
    icon: '',
    tag: 'push-notification-tag'
  };
  console.log("notificationTitle: ", notificationTitle);
  console.log("notificationOptions: ", notificationOptions);
  self.registration.showNotification(notificationTitle, notificationOptions);
});




self.addEventListener('notificationclick', function(event) {
  console.log('알림이 클릭되었습니다.', event.notification.tag);

  event.notification.close();

  // 알림 권한 확인 및 요청
  if (Notification.permission === 'granted') {
    console.log('알림 권한이 있습니다.');
    // showNotification 호출 가능
  } else if (Notification.permission === 'denied') {
    console.log('알림 권한이 거부되었습니다.');
  } else {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        console.log('알림 권한이 승인되었습니다.');
        // showNotification 호출 가능
      } else {
        console.log('알림 권한이 거부되었습니다.');
      }
    });
  }
});
