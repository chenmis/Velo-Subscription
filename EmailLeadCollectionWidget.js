import EmailLeadCollection from 'public/EmailLeadCollection'
import CrmService from 'public/CrmService'
import Validator from 'public/ValidationService'

const idsDict = {
    'container': '#container',
    'emailErrorMsg' : '#emailErrorMsg',
    'submitBtn' : '#submitBtn',
    'closePopUp' : '#closePopUp',
    'emailInput' : '#emailInput'
}

$w.onReady(() => {
    const emailSubscriptionBlock = new EmailLeadCollection(
        new CrmService(),
        new Validator(),
        idsDict
    );
    emailSubscriptionBlock.init();
});
