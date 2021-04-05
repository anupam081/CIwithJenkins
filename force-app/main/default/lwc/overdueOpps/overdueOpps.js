import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpptyOverAmount from '@salesforce/apex/ContactController.getOpptyOverAmount';
import updateOpptyStage from '@salesforce/apex/ContactController.updateOpptyStage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OverdueOpps extends LightningElement {
    @api amount = 50000;

    @wire(getOpptyOverAmount, { amount: '$amount' })
    opptiesOverAmount;

    showNotification() {
        const evt = new ShowToastEvent({
            title: 'Har Har Mahadev',
            message: 'Your request is processed successfully',
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }

    handleClick(e) {
        updateOpptyStage({
            amount: this.amount,
            stage: 'Closed Won'
        })
        .then(() => {
            refreshApex(this.opptiesOverAmount)
            .then(() => {
                this.showNotification() ;
                // do something with the refreshed data in this.opptiesOverAmount
            });
        })
        .catch((error) => {
            this.message = 'Error received: code' + error.errorCode + ', ' +
                'message ' + error.body.message;
        });
    }
}