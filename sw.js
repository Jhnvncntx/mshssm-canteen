// Inside firebase-messaging-sw.js or sw.js
// self.addEventListener('push', event => {
//   const data = event.data.json();
//   console.log('Push received:', data);

//   const options = {
//     body: data.body,
//     icon: 'school-logo.png',  // Replace with your icon URL
//   };

//   // Show the notification
//   event.waitUntil(
//     self.registration.showNotification(data.title, options)
//   );
// });


self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'Default push message body',
    icon: 'bg-image.jpg',
    badge: 'path/to/badge.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Default Title', options)
  );
});