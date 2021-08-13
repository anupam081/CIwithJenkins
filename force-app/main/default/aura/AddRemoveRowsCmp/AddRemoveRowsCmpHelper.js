({
	validateAccountRecords: function(component, event) {
        //Validate all account records
        var isValid = true;
        var accountList = component.get("v.accountList");
        for (var i = 0; i < accountList.length; i++) {
            if (accountList[i].Name == '') {
                isValid = false;
                //alert('Account Name cannot be blank on '+(i + 1)+' row number');
                this.toastMessage(component,'error','Opps!', 'Account Name cannot be blank on '+(i + 1)+' row number');
            }
        }
        return isValid;
    },
    
    toastMessage: function (component, type, title, message) {
         var toastEvent = $A.get("e.force:showToast");
    
         toastEvent.setParams({
                    "type": type,
                    "title": title,
                    "message": message
            });
    
           if(component.get('v.toastrLoaded')){
                    if(type=='error') {
                            //error call
                            toastr.error(message, title);
                    }
        
                    if(type=='success') {
                            //success message call 
                            toastr.success(message, title);
                    }
            } else {
        toastEvent.fire();
            } 
    }
})