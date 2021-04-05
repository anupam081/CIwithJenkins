public with sharing class cloneCasesController {
    
    @AuraEnabled(cacheable=true)
    public static Account searchAccount(String searchKey) {
        String key = '%' + searchKey + '%';
        List<Account> accts =  [
            SELECT Id, Name, Phone
            FROM Account
            WHERE Name LIKE :key 
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];

        if(accts != null && accts.size() > 0){
            return accts[0];
        }else{
            return null;
        }

    }
}
