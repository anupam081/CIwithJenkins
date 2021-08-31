import { LightningElement,api,track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Case.Id';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import MailingPostalCode from '@salesforce/schema/Contact.MailingPostalCode';

export default class FeedbackRatingLWC extends LightningElement {
    @api strCaseId = '5000o00003AOebcAAD';
    @track ratingentries = new Map();

    showRating(){
        var ratingData = this.template.querySelector('c-star-rating-l-w-c').getvalues();
        console.log('ratingData === '+ratingData);

            const fields = {};
            fields[ID_FIELD.fieldApiName] = this.strCaseId;
            fields[DESCRIPTION_FIELD.fieldApiName] = ratingData;
    
            const recordInput = { fields };
            updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Case Updated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.log(error);
            });
       
    }
    
    handleratingchange(event){
        console.log(event.detail);
        const temp = (event.detail).split("-");
        this.ratingentries.set(temp[0],temp[1]);
        console.log('ratingentries== '+[...this.ratingentries.entries()]);

    }
}