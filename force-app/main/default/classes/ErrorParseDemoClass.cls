public with sharing class ErrorParseDemoClass {

    @AuraEnabled
    public static List<account> listMoreRowError(){
        List<account> accList = new List<Account>();
        integer ii = 10/0;
        for(integer i=0; i<52000; i++){
            accList.add(new Account(Name='Acc' + i));
        }
        return accList;
    }

    @AuraEnabled
    public static void validationerro(){      
     
        //enable billing address validation on account to test this
        try {
            Account ac = new Account(Name='Test Account');
            insert ac;
            
        } catch (Exception e) {
            throw new AuraHandledException(''+e);
        }
        
    }
}
