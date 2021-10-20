import { LightningElement, api } from 'lwc';

export default class LwcForFlows extends LightningElement {
    @api records = [];
    @api fieldColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Title', fieldName: 'Title'},
        { label: 'Department', fieldName: 'Department' }
    ];
}