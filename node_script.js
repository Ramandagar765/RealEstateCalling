// update_contacts.js
const axios = require('axios');

const CONTACT_IDS = [139]; 
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NzU5Njk2MiwiZXhwIjoxNzU3NjgzMzYyfQ.yS328zZuZjmWlqUeQT86OLdDhOHPXaYdBrK1dd23ghc';
const SERVER_URL = 'https://dialer.cwsdev1.com'; // or your local server

async function updateContacts() {
  for (const contactId of CONTACT_IDS) {
    try {
      console.log(`Updating contact ID: ${contactId}`);
      
      const response = await axios.put(
        `${SERVER_URL}/api/admin/contacts/${contactId}`,
        { status: 'pending' },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_TOKEN}`
          }
        }
      );
      
      console.log(`✅ Contact ${contactId} updated successfully`);
    } catch (error) {
      console.error(`❌ Error updating contact ${contactId}:`, error.response?.data || error.message);
    }
  }
}

updateContacts();