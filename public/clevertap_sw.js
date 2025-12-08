importScripts("https://d2r1yp2w7bby2u.cloudfront.net/js/clevertap_sw.js");

self.addEventListener("notificationclick", function (event) {
  var notification = event.notification;
  var action = event.action;
  var link = notification.data.deepLink; // Handles deep links from dashboard

  if (action === "close") {
    notification.close();
  } else {
    clients.openWindow(link || "/");
    notification.close();
  }
});
