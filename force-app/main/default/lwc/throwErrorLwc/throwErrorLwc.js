import { LightningElement } from 'lwc';
import { reduceErrors } from 'c/errorHandlingUtilLwc';
import listMoreRowError from '@salesforce/apex/ErrorParseDemoClass.listMoreRowError';
import validationerro from '@salesforce/apex/ErrorParseDemoClass.validationerro';

export default class ThrowErrorLwc extends LightningElement {
    modalmsg;
    modalheading;
    
    firstError() {
        listMoreRowError()
        .then(result => {
            
            console.log('result = '+JSON.stringify(result));
        })
        .catch(error => {
            console.log(error);
            this.showCustomNotice('Error', reduceErrors(error), 'error');
        });
    }

    secondError(){
        validationerro()
        .then(result => {

        })
        .catch(error => {
            console.log(JSON.stringify(error));
            this.showCustomNotice('Error', reduceErrors(error), 'error');
        });
    }

    openModal(){
        this.modalmsg = 'Hi how are you?';
        this.modalheading = 'Say Hello';
        this.template.querySelector('c-modal-Pop-up-util-lwc').openModal();

    }

    showCustomNotice(title, message, variant) {
        //Here we are calling child component method
        this.template.querySelector('c-custom-toast-lwc').updateDetails(title, message, variant);
        this.template.querySelector('c-custom-toast-lwc').showCustomNotice();
    }
}