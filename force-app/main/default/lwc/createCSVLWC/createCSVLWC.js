import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/FieldSetHelper.getAccounts';
import { exportCSVFile } from 'c/exportCSVUtils'; // exported another LWC created just for Utils.


export default class CreateCSVLWC extends LightningElement {

    accountData;

    @wire(getAccounts)
    accountHandler({data}){
        if(data){
            console.log('Account data == '+JSON.stringify(data));
            this.accountData = data;
        }
    }

    userData= [
        {
            username:"Anupam",
            age:25,
            title:"Developer"
        },
        {
            username: 'Salesforcetroop',
            age: 2,
            title: 'Youtube channel'
        },
        {
            username: 'Friends',
            age: 20,
            title: 'Netflix series'
        }
    ];

    headers = {
        username:"User Name",
        age:"Age",
        title:"Title"
    };

    accountHeaders ={
        Id:"Record Id",
        Name:"Name",
        AnnualRevenue:"Annual Revenue",
        Industry:"Industry",
        Phone:"Phone"

    };

    downloadUserDetails(){
        console.log("download user details triggered.");
        exportCSVFile(this.userData, "user detail");
    }
    downloadAccountData(){
        console.log("download account details triggered.");
        exportCSVFile(this.accountData, "accounts detail");
    }
   

}