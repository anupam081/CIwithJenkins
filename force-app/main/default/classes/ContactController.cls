public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            WHERE Name LIKE :key and Email != null
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpptyOverAmount(Decimal amount) {
        return [SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE Amount > :amount order by Amount desc limit 2];
    }

    @AuraEnabled
    public static void updateOpptyStage(Decimal amount, String stage) {
        for (List<Opportunity> oppts:
            [SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE Amount > :amount order by Amount desc limit 2]) {
                for(Opportunity o : oppts) {
                    o.StageName = stage;
                }
                update oppts;
            }
            return;
    }
}
