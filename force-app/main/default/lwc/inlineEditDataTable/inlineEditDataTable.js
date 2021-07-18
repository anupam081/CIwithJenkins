import { LightningElement,wire, api} from 'lwc';
import getContacts from '@salesforce/apex/FieldSetHelper.getContacts';
import updateContacts from '@salesforce/apex/FieldSetHelper.updateContacts';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import ID_FIELD from '@salesforce/schema/Contact.Id';

const COLS = [
    { label: 'First Name', fieldName: 'FirstName', editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Title', fieldName: 'Title' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' }
];

export default class InlineEditDataTable extends LightningElement {

    @api recordId;
    columns = COLS;
    draftValues = [];

    @wire(getContacts, {accId: '$recordId'})
    contact;

    handleSave(event) {

        // this is for single row update
        const fields = {}; 
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[FIRSTNAME_FIELD.fieldApiName] = event.detail.draftValues[0].FirstName;
        fields[LASTNAME_FIELD.fieldApiName] = event.detail.draftValues[0].LastName;

        const recordInput = {fields};

        //this is to handle multiple records
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        /*
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(contacts => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contacts updated Successfully',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
    
             // Display fresh data in the datatable
             return refreshApex(this.contact);
        }).catch(error => {
            // Handle error
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
        */
        //this is to handle multiple records ends

        // this is to handle update through apex
        const updatedFields = event.detail.draftValues;
        console.log('Row1 == '+ JSON.stringify(updatedFields)) ;
        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map(row => {return {"recordId" : row.Id} });
        console.log('notifyChangeIds  == '+JSON.stringify(notifyChangeIds));

        try {
            // Pass edited fields to the updateContacts Apex controller
            const result = updateContacts({data: updatedFields});
            console.log("Apex update result: "+ JSON.stringify(result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated Successfully always',
                    variant: 'success'
                })
            );
    
            // Refresh LDS cache and wires
            getRecordNotifyChange(notifyChangeIds);
    
            // Display fresh data in the datatable
            refreshApex(this.contact).then(() => {
                // Clear all draft values in the datatable
                this.draftValues = [];
            });
       } catch(error) {
               this.dispatchEvent(
                   new ShowToastEvent({
                       title: 'Error updating or refreshing records',
                       message: error.body.message,
                       variant: 'error'
                   })
             );
        };
        // this is to handle update through apex ends

        //update record only supports single object        
     /*   updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
            // Display fresh data in the datatable
            return refreshApex(this.contact).then(() => {

                // Clear all draft values in the datatable
                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });*/
    }
}