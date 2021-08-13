import { LightningElement, api} from 'lwc';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { getObjectInfo } from 'lightning/uiObjectInfoApi';
//import search from '@salesforce/apex/FieldSetHelper.search';
//const DELAY = 300;

export default class CustomLookupLWC extends LightningElement {
    @api childObjectApiName = 'Contact'; //Contact is the default value
    @api targetFieldApiName = 'AccountId'; //AccountId is the default value
    @api fieldLabel = 'Your field label here';
    @api disabled = false;
    @api value;
    @api required = false;

    handleChange(event) {
        // Creates the event
        const selectedEvent = new CustomEvent('valueselected', {
            detail: event.detail.value
        });
        //dispatching the custom event
        this.dispatchEvent(selectedEvent);
    }

    @api isValid() {
        if (this.required) {
            this.template.querySelector('lightning-input-field').reportValidity();
        }
    }
}