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

    @AuraEnabled
    public static Map<String, String> getAllColumns(){
        Map<String, String> allColumnMap = new Map<String, String>();
        allColumnMap.put('Name', 'Account Name');
        allColumnMap.put('Website', 'Account Website');
        allColumnMap.put('Phone', 'Account Phone');
        allColumnMap.put('CreatedDate', 'Account Created on');
        return allColumnMap;
    }
    @AuraEnabled
    public static List<Account> getAllAccountData(){
        return [Select Id, Name, Website, Phone, CreatedDate from Account LIMIT 100];
    }
}
