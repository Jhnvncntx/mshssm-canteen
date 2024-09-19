//CUSTOMERS LOGIN

const identifiedCustomers = {
    'Jhon Vincent Adolfo': '122679120002',
    'Larriane Lopez': '104636120020',
    'Elaine Estropia': '104649130130',
    'Trisha Gutierrez': '104642130143',
    'Carl Jayson Concepcion': '1070401203555',
    'Christian Bondoc': '104642120199',
    'Aira Gabriel': '151519120024',
    'Raiden Cabuslay': '106571120002',
    'Timothy Eltanal': '107941120113',
    'Jhe Phie Julio': '104649120022'
  };

  const customerForm = document.getElementById('customerForm');
  
  customerForm.addEventListener('submit', event => {
    event.preventDefault();
  
    const customerIdInput = document.getElementById('customerIdInput').value;
  
    // Get an array of values from the identifiedCustomers object
    const identifiers = Object.values(identifiedCustomers);
  
    // Check if the customerIdInput exists among the values
    if (identifiers.includes(customerIdInput)) {
      // Find the corresponding user name for the identifier
      const userName = Object.keys(identifiedCustomers).find(key => identifiedCustomers[key] === customerIdInput);
      sessionStorage.setItem('loggedIn', customerIdInput)
  
      alert('Login successful! Welcome, User ' + userName);
  
      window.location.href = '/website.html';
    } else {
      alert('Invalid User. Please try again.');
    }
  });

//STAFF's LOGIN

const identifiedStaffs = {
  'Staff1': '123456789',
  'Staff2': '987654321'
  };

  const staffForm = document.getElementById('staffForm');

  staffForm.addEventListener('submit', event => {
    event.preventDefault();
  
    const staffIdInput = document.getElementById('staffIdInput').value;
  
    // Get an array of values from the identifiedStaffs object
    const identifiers = Object.values(identifiedStaffs);
  
    // Check if the staffIdInput exists among the values
    if (identifiers.includes(staffIdInput)) {
      // Find the corresponding user name for the identifier
      const userName = Object.keys(identifiedStaffs).find(key => identifiedStaffs[key] === staffIdInput);
      sessionStorage.setItem('loggedIn', staffIdInput)
  
      alert('Login successful! Welcome, User ' + userName);
  
      window.location.href = '/store.html';
    } else {
      alert('Invalid User. Please try again.');
    }
  });

// Iterate through all keys in localStorage (LOG LOCAL STORAGE)
          // for (let i = 0; i < localStorage.length; i++) {
          //   let key = localStorage.key(i); // Get the key at index i
          //   let value = localStorage.getItem(key); // Get the value associated with the key
          //   console.log(`Key: ${key}, Value: ${value}`); // Log key and value
          // }

function removeOrders() {
  localStorage.removeItem('order')
  localStorage.removeItem('order2')
  localStorage.removeItem('order3')
  localStorage.removeItem('order4')
  localStorage.removeItem('order5')
  console.log(`orders removed!`)
}

