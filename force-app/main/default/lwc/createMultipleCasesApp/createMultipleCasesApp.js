import { LightningElement } from 'lwc';
import searchAccount from '@salesforce/apex/cloneCasesController.searchAccount';

export default class CreateMultipleCasesApp extends LightningElement {
    searchValue = '';
    accounts;

    handleStringChange(event){
        this.searchValue = event.target.value;
        searchAccount({ searchKey: this.searchValue })
        .then((result) => {
            this.accounts = result;
            this.error = undefined;
        }).catch((error) => {
            this.error = error;
            this.accounts = undefined;
        });

    }
}