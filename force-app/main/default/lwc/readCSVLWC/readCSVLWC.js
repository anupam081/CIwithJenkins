import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import csvFileRead from '@salesforce/apex/FieldSetHelper.csvFileRead';

const columnsAccount = [
    { label: 'Name', fieldName: 'recordLink', type:'url', typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'} }, 
    { label: 'Source', fieldName: 'AccountSource' },
    { label: 'Account Site', fieldName: 'Site'}, 
    { label: 'Type', fieldName: 'Type'}, 
    { label: 'Website', fieldName: 'Website', type:'url'}
];

export default class ReadCSVLWC extends LightningElement {
    @api recordId;
    @track error;
    @track columnsAccount = columnsAccount;
    @track data = [];
    @track showLoadingSpinner = false;

    MAX_FILE_SIZE = 2000000; //Max file size 2.0 MB
    filesUploaded = [];
    filename;

    // accepted parameters
    get acceptedCSVFormats() {
        return ['.csv'];
    }

    uploadFileHandler(event) {
        // Get the list of records from the uploaded files
        const uploadedFiles = event.detail.files;        

        // calling apex class csvFileread method
        csvFileRead({contentDocumentId : uploadedFiles[0].documentId})
        .then(result => {
            window.console.log('result ===> '+result);
            //add link to the account name column           
            if(result){
                var tempOppList = [];
                result.forEach(element => {
                    let tempRec = Object.assign({}, element); 
                    tempRec.recordLink = '/' + tempRec.Id;
                    tempOppList.push(tempRec);
                });
            }
            
            this.data = tempOppList;
            console.log('this.data ===> '+ JSON.stringify(this.data));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Accounts are created according to the CSV file upload!!!',
                    variant: 'Success',
                }),
            );
        })
        .catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: JSON.stringify(error),
                    variant: 'error',
                }),
            );     
        })

    }

    importcsv(event){
        if (event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            this.filename = event.target.files[0].name;
            console.log(this.filename);
            if (this.filesUploaded.size > this.MAX_FILE_SIZE) {
                this.filename = 'File Size is to long to process';
            } 
        }
    }

    readFiles() {
        [...this.template
            .querySelector('lightning-input')
            .files].forEach(async file => {
                try {
                    const result = await this.load(file);
                    // Process the CSV here
                  this.showLoadingSpinner = false;

                    console.log(result);
                   // this.processData(result);
                     //this.data=JSON.parse(this.csvJSON(result));
                     this.data=this.csvJSON(result);
                    console.log('data..'+JSON.stringify(this.data));

                } catch(e) {
                    // handle file load exception
                    console.log('exception....' +e.message);
                }
            });
    }
    async load(file) {
        return new Promise((resolve, reject) => {
        this.showLoadingSpinner = true;
            const reader = new FileReader();
            // Read file into memory as UTF-8      
            //reader.readAsText(file);
            reader.onload = function() {
                resolve(reader.result);
            };
            reader.onerror = function() {
                reject(reader.error);
            };
            reader.readAsText(file);
        });
    }

     
//process CSV input to JSON
 
 csvJSON(csv){

    var lines=csv.split(/\r\n|\n/);

    var result = [];

    var headers=lines[0].split(",");
    console.log('headers..'+JSON.stringify(headers));
    for(var i=1;i<lines.length-1;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++){
            if(headers[j] === 'Name'){
                obj['recordLink'] = currentline[j];
            }
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);

    }
    console.log('result..'+JSON.stringify(result));
    //return result; //JavaScript object
    //return JSON.stringify(result); //JSON
    return result;
 }

}