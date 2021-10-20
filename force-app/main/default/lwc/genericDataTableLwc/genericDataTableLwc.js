import { LightningElement,api,track } from 'lwc';

//https://sfdcflight.blogspot.com/2020/04/generic-lightning-data-table-using.html
export default class GenericDataTableLwc extends LightningElement {
    _allRecords = [];
    @track columns = [];

    @api 
    get columnvalue(){};
    set columnvalue(value){
        let columnValues = value;
        if(columnValues !== undefined){
            this.columns = value;
        }
    }

    @api
    get genericData(){}
    set genericData(value){
        this._allRecords = JSON.parse(JSON.stringify(value));
    }

    @api
    get finalData(){
        let allrecords = [];
        for(let i = 0; i < this._allRecords.length; i++){
            let rowData = this._allRecords[i];
            let row = rowData;
            row.Id = rowData.Id;
            for(let col in this.columnValues){
                if(col.fieldName != 'Id'){
                    row[col.fieldName] = rowData[col.fieldName];
                }
            }
            allrecords.push(row);
        }
        return allrecords;
    }

}