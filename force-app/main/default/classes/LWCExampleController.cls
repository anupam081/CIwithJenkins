public inherited sharing class LWCExampleController {
    @AuraEnabled(cacheable=true)
    public static list<ContentVersion> retriveFiles(){
        return [SELECT Id, Title, FileExtension, ContentDocumentId From ContentVersion];
    }
}