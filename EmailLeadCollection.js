export default class EmailLeadCollection {
  
    constructor(CRMService, Validator, IdsDict) {
      this.crmService = CRMService;
      this.validationService = Validator;
      this.idsDict = IdsDict;
    }
  
    init() {
      $w(this.idsDict['container']).hide();
      $w(this.idsDict['emailErrorMsg']).hide(); // hide the error message by default
  
      $w(this.idsDict['submitBtn']).onClick(() => this.handleSubmit());
      $w(this.idsDict['closePopUp']).onClick(() => this.closePopup());
    }
  
  
    isInputValid(email) {
        // Validate email
        let emailValidationResual = this.validationService.isEmailValid(email);
        
        if (!emailValidationResual) {
          $w(this.idsDict['emailErrorMsg']).text = "Invalid email address.";
          $w(this.idsDict['emailErrorMsg']).show();
          return false;
        }
  
        return true;
    }
  
    async handleSubmit() {
      try {
        const email = $w(this.idsDict['emailInput']).value;
        
        if(!this.isInputValid(email)) {
          return;
        }
  
        await this.crmService.addContact(email);
        $w(this.idsDict['container']).show();
        $w(this.idsDict['emailErrorMsg']).hide(); 
        
        $w(this.idsDict['emailInput']).value = '';
        $w(this.idsDict['emailInput']).placeholder = "Enter your email";
        
      } catch (error) {
        $w(this.idsDict['submitBtn']).label = "Error";
      }
    }
  
    closePopup() {
      $w(this.idsDict['container']).hide();
    }
  }
  