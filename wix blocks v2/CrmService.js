import wixCrmBackend from 'wix-crm-backend';

const CrmService = {
    contact: {
        get: async function (email = "") {
            try {
                const contactInfo = {
                    emails: [{ tag: "MAIN", email, primary: true }]
                };
                const contactId = await wixCrmBackend.contacts.appendOrCreateContact(contactInfo);
                return contactId.contactId || "";
            } catch (error) {
                console.error('Error getting contact ID:', error);
                throw new Error('Could not get contact ID');
            }
        },
        emailContact: async function (contactId = "", vars = {}) {
            try {
                const options = { variables: vars };
                console.log('Contact ID:', contactId);
                await wixCrmBackend.triggeredEmails.emailContact("TpDL7Z6", contactId, options);
                return true;
            } catch (err) {
                console.error('Error sending email:', err, err.stack);
                return false;
            }
        }
    },

    sendEmail: async function (email = "") {
        try {
            const contactId = await this.contact.get(email);
            if (contactId) {
                const vars = {
                    name: email.split('@')[0],
                    websiteUrl: "https://www.wix.com"
                };
                return await this.contact.emailContact(contactId, vars);
            }
            console.error("Contact ID error");
            return false;
        } catch (error) {
            console.error('Error in sendEmail:', error);
            throw error;
        }
    }
}

export default CrmService;
