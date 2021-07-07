import { LightningElement, wire, track } from 'lwc';

// importing Apex class method
import retriveFiles from '@salesforce/apex/LWCExampleController.retriveFiles';

// importing navigation service
import { NavigationMixin } from 'lightning/navigation';

// extends the class to 'NavigationMixin' - for file preivew
export default class filePreviewLwc extends NavigationMixin(LightningElement) {
    // reactive variables
    @track files;

    // Reteriving the files to preview
    @wire(retriveFiles)
    filesData({data, error}) {
        if(data) {
            window.console.log('data ===> '+data);
            this.files = data;
        }
        else if(error) {
            window.console.log('error ===> '+JSON.stringify(error));
        }
    }

    // when you click the preview button this method will call and
    // it will show the preview of the file based on ContentDocumentId
    filePreview(event) {
        // Naviagation Service to the show preview
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state : {
                // assigning ContentDocumentId to show the preview of file
                selectedRecordId:event.currentTarget.dataset.id
            }
          })
    }
}