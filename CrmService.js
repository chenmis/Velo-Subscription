import wixCrmFrontend from 'wix-crm';

export default class CrmService {
  async addContact(email) {
    const contactInfo = {
      "emails": [{ email }]
    };

    try {
      return await wixCrmFrontend.contacts.appendOrCreateContact(contactInfo);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to add or update the contact.");
    }
  }
}