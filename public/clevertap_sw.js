importScripts("https://d2r1yp2w7bby2u.cloudfront.net/js/clevertap_sw.js");

self.addEventListener("notificationclick", function (event) {
  var notification = event.notification;
  var action = event.action;
  var link = notification.data.deepLink;

  if (action === "close") {
    notification.close();
  } else {
    // Open the link (or Home if none provided)
    clients.openWindow(link || "/");
    notification.close();
  }
});
