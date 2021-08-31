import { LightningElement,track } from 'lwc';
import getAllObjects from '@salesforce/apex/FieldSetHelper.getAllObjects';

export default class UseMapinLwc extends LightningElement {
    @track objects = [];
    @track error;

    connectedCallback(){
        getAllObjects()
            .then(result => {
                //this.objects = result;
                console.log(' Result ==> ' + JSON.stringify(result));
                this.objects = Object.keys(result).map(key => ({ Id: key, value: result[key] }));
                /*
                for(let key in result) {
                    // Preventing unexcepted data
                    if (result.hasOwnProperty(key)) { // Filtering the data in the loop
                        this.objects.push({value:result[key], key:key});
                    }
                }*/
            })
            .catch(error => {
                this.error = error;
            });
    
    }
}