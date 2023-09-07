import { createClient, ApiKeyStrategy } from '@wix/api-client';
import { contacts } from '@wix/crm';

const wixClient = createClient({
modules: { contacts },
auth: ApiKeyStrategy({
    siteId: 'MY-SITE-ID',
    apiKey: 'MY-API-KEY'
})
});

const idsDict = {
    'container': '#container',
    'emailErrorMsg' : '#emailErrorMsg',
    'submitBtn' : '#submitBtn',
    'closePopUp' : '#closePopUp',
    'emailInput' : '#emailInput'
};

document.addEventListener('DOMContentLoaded', (event) => {
    const emailSubscriptionBlock = new EmailLeadCollection(wixClient, new Validator(), idsDict);
    emailSubscriptionBlock.init();
});

class EmailLeadCollection {
    
    constructor(wixClient, Validator, IdsDict) {
    this.wixClient = wixClient;
    this.validator = Validator;
    this.idsDict = IdsDict;
    }

    init() {
    document.querySelector(this.idsDict['container']).style.display = 'none';
    document.querySelector(this.idsDict['emailErrorMsg']).style.display = 'none'; 

    document.querySelector(this.idsDict['submitBtn']).addEventListener('click', () => this.handleSubmit());
    document.querySelector(this.idsDict['closePopUp']).addEventListener('click', () => this.closePopup());
    }

    isInputValid(email) {
    let emailValidationResult = this.validator.isEmailValid(email);
        
    if (!emailValidationResult) {
        document.querySelector(this.idsDict['emailErrorMsg']).innerText = "Invalid email address.";
        document.querySelector(this.idsDict['emailErrorMsg']).style.display = 'block';
        return false;
    }

    return true;
    }

    async handleSubmit() {
    try {
        const email = document.querySelector(this.idsDict['emailInput']).value;
        
        if(!this.isInputValid(email)) {
        return;
        }

        await this.createContact({email});
        document.querySelector(this.idsDict['container']).style.display = 'block';
        document.querySelector(this.idsDict['emailErrorMsg']).style.display = 'none'; 
        
        document.querySelector(this.idsDict['emailInput']).value = '';
        document.querySelector(this.idsDict['emailInput']).placeholder = "Enter your email";
        
    } catch (error) {
        document.querySelector(this.idsDict['submitBtn']).innerText = "Error";
    }
    }

    async createContact(info) {
    try {
        await this.wixClient.contacts.createContact(info);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to add or update the contact.");
    }
    }

    closePopup() {
    document.querySelector(this.idsDict['container']).style.display = 'none';
    }
}

class Validator {
    isEmailValid(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
    }
}
