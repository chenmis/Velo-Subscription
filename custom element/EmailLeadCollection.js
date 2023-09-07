import { createClient, ApiKeyStrategy } from '@wix/api-client';
import { contacts } from '@wix/crm';

const wixClient = createClient({
  modules: { contacts },
  auth: ApiKeyStrategy({
    siteId: 'MY-SITE-ID',
    apiKey: 'MY-API-KEY'
  })
});

async function createContact(info, options) {
  const response = await wixClient.contacts.createContact(info, options);
}

class EmailLeadCollection extends HTMLElement {
    constructor() {
      super();
      // Initialize any variables you need
      this.emailInput = this.querySelector('#emailInput');
      this.submitBtn = this.querySelector('#submitBtn');
      this.emailErrorMsg = this.querySelector('#emailErrorMsg');
      this.container = this.querySelector('#container');
      this.closePopUp = this.querySelector('#closePopUp');
    }
  
    connectedCallback() {
      this.container.style.display = 'none';
      this.emailErrorMsg.style.display = 'none';
  
      this.submitBtn.addEventListener('click', this.handleSubmit.bind(this));
      this.closePopUp.addEventListener('click', this.closePopup.bind(this));
    }
  
    isEmailValid(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    }
  
    async addContact(email) {
      const contactInfo = {
        "emails": [{ email }]
      };
  
      try {
        await createContact(contactInfo);
        return "Contact added successfully";
      } catch (error) {
        console.error(error);
        throw new Error("Failed to add or update the contact.");
      }
    }
  
    async handleSubmit() {
      try {
        const email = this.emailInput.value;
  
        if (!this.isEmailValid(email)) {
          this.emailErrorMsg.textContent = "Invalid email address.";
          this.emailErrorMsg.style.display = 'block';
          return;
        }
  
        await this.addContact(email);
        this.container.style.display = 'block';
        this.emailErrorMsg.style.display = 'none';
        
        this.emailInput.value = '';
        this.emailInput.placeholder = "Enter your email";
      } catch (error) {
        this.submitBtn.textContent = "Error";
      }
    }
  
    closePopup() {
      this.container.style.display = 'none';
    }
}
  
customElements.define('email-lead-collection', EmailLeadCollection);
s