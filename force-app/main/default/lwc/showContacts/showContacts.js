import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

export default class ShowContacts extends LightningElement {
    searchKey = '';
    @wire(getContactList, { searchKey: '$searchKey' }) contacts;

    handleKeyChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
}