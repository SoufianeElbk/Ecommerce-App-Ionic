// Address mock data
export const addresses = [
  {
    id: 1,
    type: 'home',
    name: 'John Doe',
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States',
    phone: '+1 415-555-1234',
    isDefault: true
  },
  {
    id: 2,
    type: 'work',
    name: 'John Doe',
    street: '456 Market Street, Suite 300',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    country: 'United States',
    phone: '+1 415-555-5678',
    isDefault: false
  }
];

// Credit card mock data
export const cards = [
  {
    id: 1,
    type: 'visa',
    name: 'John Doe',
    number: '•••• •••• •••• 4242',
    expiry: '09/25',
    isDefault: true
  },
  {
    id: 2,
    type: 'mastercard',
    name: 'John Doe',
    number: '•••• •••• •••• 5678',
    expiry: '12/24',
    isDefault: false
  }
];

// Order summary data
export const orderSummary = {
  subtotal: 249.95,
  shipping: 4.99,
  tax: 22.50,
  total: 277.44
}; 