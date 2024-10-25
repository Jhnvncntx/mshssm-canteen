// app.js
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
      return Notification.requestPermission();
    })
    .then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        return navigator.serviceWorker.ready; // Ensure the service worker is ready
      } else {
        console.error('Unable to get permission to notify.');
      }
    })
    .then(registration => {
      // Register the user for push notifications
      subscribeUserToPush(registration);
    })
    .catch(err => console.error('Service Worker registration failed:', err));
}

// function subscribeUserToPush(registration) {
//   const applicationServerKey = urlB64ToUint8Array('BGym_JA2SQCChHM3O2d8h9R0pRc7esVgRUCKMqn5a3z6-4wEIAZjW8OE3myYAEBSe71beL86awdFBI5BktH8U5c'); // Use your actual public key here
//   registration.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: applicationServerKey
//   })
//   .then(subscription => {
//     console.log('User is subscribed:', subscription);

//     // Instead of checking for keys, just send the endpoint
//     const subscriptionData = {
//       endpoint: subscription.endpoint,
//       customerName: `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`
//     };

//     // Send subscription to your server without keys
//     sendSubscriptionToServer(subscriptionData);
//   })
//   .catch(err => {
//     console.error('Failed to subscribe user:', err);
//   });
// }

function subscribeUserToPush(registration) {
  const applicationServerKey = urlB64ToUint8Array('BGym_JA2SQCChHM3O2d8h9R0pRc7esVgRUCKMqn5a3z6-4wEIAZjW8OE3myYAEBSe71beL86awdFBI5BktH8U5c'); // Your actual public key

  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(subscription => {
    console.log('User is subscribed:', subscription);

    // Extract keys
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh'))));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth'))));

    console.log('Extracted keys:', { p256dh, auth }); // Log the keys

    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: p256dh,
        auth: auth,
      },
      customerName: `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`
    };

    // Send the subscription data to your server
    sendSubscriptionToServer(subscriptionData);
  })
  .catch(err => {
    console.error('Failed to subscribe user:', err);
  });
}


function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

function sendSubscriptionToServer(subscriptionData) {

  return fetch('https://mshssm-canteen.onrender.com/api/orders/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscriptionData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => console.error('Error sending subscription to server:', error));
}