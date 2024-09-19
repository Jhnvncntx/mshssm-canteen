//isLoggedIn
const loggedIn = sessionStorage.getItem('loggedIn')
const staff1 = localStorage.getItem('staff1')

// Iterate through all keys in localStorage CONSOLE LOCALSTORAGE
          // for (let i = 0; i < localStorage.length; i++) {
          //   let key = localStorage.key(i); // Get the key at index i
          //   let value = localStorage.getItem(key); // Get the value associated with the key
          //   console.log(`Key: ${key}, Value: ${value}`); // Log key and value
          // }
//Read LocalStorage
const localStorageToOject = {}

const numberOfItems = localStorage.length

for (let i = 0; i < numberOfItems; i++) {
  const key = localStorage.key(i)

  const value = localStorage.getItem(key)

  localStorageToOject[key] = value
}

const idArray = Object.values(localStorageToOject)

if (idArray.includes(loggedIn)) {
  console.log(`Verified Staff Logged In!`)
} else {
  window.location.href = '/index.html'
  console.log('Not verified Staff tried to login!')
}

const orders = document.getElementById('orders')

const orderJSON = localStorage.getItem('order')

const order = orderJSON ? JSON.parse(orderJSON) : {};


if (Object.keys(order).length === 0) {
  console.log('No items in cart');
} else {
  console.log('Cart retrieved:', order);
}



