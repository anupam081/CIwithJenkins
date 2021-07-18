import { LightningElement } from 'lwc';
import generatePDF from '@salesforce/apex/FieldSetHelper.generatePDF';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// importing navigation service
import { NavigationMixin } from 'lightning/navigation';

export default class GeneratePdfLWC extends NavigationMixin(LightningElement) {

    allowedFormats =  ['font', 'size', 'bold', 'italic', 'underline', 'strike',
    'list', 'indent', 'align', 'link', 'image', 'clean', 'table', 'header', 'color',
    'background','code','code-block'];

    //this method will display initial text
    get myVal() {
        return '**Generate PDF using LWC Component**';
    }

    attachment; //this will hold attachment reference

     /*This method extracts the html from input rich text 
        and pass this to apex class' method via implcit call
    */
        saveAsPdf(){
            const editor = this.template.querySelector('lightning-input-rich-text');
            
            //implicit calling apex method
            generatePDF({txtValue: editor.value})
            .then((result)=>{
                this.attachment = result;
                    console.log('attachment id=' + this.attachment.Id);
                    console.log('attachment id=' + this.attachment.ContentDocumentId);
                    //show success message
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'PDF generated successfully with Id:' + this.attachment.Id,
                            variant: 'success',
                        }),
                    );

                    // preview the file just created
                    this[NavigationMixin.Navigate]({
                        type: 'standard__namedPage',
                        attributes: {
                            pageName: 'filePreview'
                        },
                        state : {
                            // assigning ContentDocumentId to show the preview of file
                            selectedRecordId: this.attachment.ContentDocumentId
                        }
                      })


            })
            .catch(error=>{
                //show error message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating Attachment record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            })
        }

    
        /*
    This method updates the selected text with defined format
    */
    handleClick() {
        const editor  = this.template.querySelector('lightning-input-rich-text');
        const textToInsert = 'Journey to Salesforce'
        editor.setRangeText(textToInsert, undefined, undefined, 'select')
        editor.setFormat({bold: true, size:24, color: 'green', align: 'center',});
    }
}