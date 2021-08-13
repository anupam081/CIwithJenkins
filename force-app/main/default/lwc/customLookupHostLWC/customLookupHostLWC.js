import { LightningElement, api } from 'lwc';

export default class CustomLookupHostLWC extends LightningElement {
    @api tilelabel = 'Custom Lookup';
    selectedRecordId; //store the record id of the selected 
    handleValueSelcted(event) {
        this.selectedRecordId = event.detail;
    }
}