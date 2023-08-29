import { contacts } from 'wix-crm-frontend';

export default class CrmService {
  async addContact(email) {
    const contactInfo = {
      "emails": [{ email }]
    };

    try {
      return await contacts.appendOrCreateContact(contactInfo);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}