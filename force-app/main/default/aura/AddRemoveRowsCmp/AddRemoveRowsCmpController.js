({
	 addRow: function(component, event, helper) {
        //get the account List from component  
        var accountList = component.get("v.accountList");
        //Add New Account Record
        accountList.push({
            'sobjectType': 'Account',
            'Name': '',
            'Phone': '',
            'Fax': '',
            'Website ': '', 
            
        });
        component.set("v.accountList", accountList);
    },
    
    removeRecord: function(component, event, helper) {
        //Get the account list
        var accountList = component.get("v.accountList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        //Remove single record from account list
        accountList.splice(index, 1);
        //Set modified account list
        component.set("v.accountList", accountList);
    },
    	
    saveAccounts: function(component, event, helper) {      
        if (helper.validateAccountRecords(component, event)) {
            //Call Apex method and pass account list as a parameters
            var action = component.get("c.saveAccountList");
            action.setParams({
                "accList": component.get("v.accountList")
            });
            action.setCallback(this, function(response) {
                //get response status 
                var state = response.getState();
                if (state === "SUCCESS") {
                    //set empty account list
                    component.set("v.accountList", []);
                    //alert('Accounts created successfully');
                    helper.toastMessage(component,'success','Success!', 'Accounts created successfully' );
                }
            }); 
            $A.enqueueAction(action);
        }
    }    
})