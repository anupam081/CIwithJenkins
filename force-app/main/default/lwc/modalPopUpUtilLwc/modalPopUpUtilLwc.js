import { LightningElement,api } from 'lwc';

export default class ModalPopUpUtilLwc extends LightningElement {
    @api showModal = false;
    @api message;
    @api modalHeading;

    @api
    openModal() {
        console.log('msg = '+this.message+', modalHeading='+this.modalHeading);
        this.showModal = true;
    }

    @api
    closeModal() {
        this.showModal = false;
    }
}