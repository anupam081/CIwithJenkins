import { LightningElement,api } from 'lwc';
import { reduceErrors } from 'c/errorHandlingUtilLwc';
import listMoreRowError from '@salesforce/apex/ErrorParseDemoClass.listMoreRowError';
import validationerro from '@salesforce/apex/ErrorParseDemoClass.validationerro';
import columnName from '@salesforce/apex/ErrorParseDemoClass.getAllColumns';
import dataTableContent  from '@salesforce/apex/ErrorParseDemoClass.getAllAccountData';


export default class ThrowErrorLwc extends LightningElement {
    @api columns;
    @api accountData = [];
    
   // columnMinWidthSet = false;
    modalmsg;
    modalheading;
    showModal;

    connectedCallback(){
        this.setupDatatable();
        
    }

   /*
    renderedCallback() { 
        if(!this.columnMinWidthSet){
            const someDataTable = this.template.querySelector('.dataTableClassName');
            if(someDataTable ){            
                someDataTable.minColumnWidth = someDataTable.minColumnWidth <= 50 ? 100 : someDataTable.minColumnWidth;
                this.columnMinWidthSet = true;
            }
        }
    }
  */

    //setup column and data for generic datatable
    setupDatatable(){
        columnName().then(result => {
            let columnData = []
            for (let key in result) {
                columnData.push({
                    label : result[key],
                    fieldName : key
                    //initialWidth: 80
                })
            }
            this.columns = columnData;
        }).catch(error => {
            window.alert(error);
        });
        dataTableContent().then(response => {
            this.accountData = response;
        }).catch(error => {
            window.alert(error);
        });
    }

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
        this.modalheading = 'Say Hello';2
        //this.showModal = true;
        this.template.querySelector('c-modal-Pop-up-util-lwc').openModal();

    }

    showCustomNotice(title, message, variant) {
        //Here we are calling child component method
        this.template.querySelector('c-custom-toast-lwc').updateDetails(title, message, variant);
        this.template.querySelector('c-custom-toast-lwc').showCustomNotice();
    }
}