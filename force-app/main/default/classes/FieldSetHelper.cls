public with sharing class FieldSetHelper {
    
    @AuraEnabled (cacheable=true)
    public static String getFieldsAndRecords(String strObjectApiName, String strfieldSetName,
                                             String criteriaField, String criteriaFieldValue){
        
        Map<String, String> returnMap = new Map<String,String>();
        if(!String.isEmpty(strObjectApiName) && !String.isEmpty(strfieldSetName)){
            //get fields from FieldSet
            SObject sObj = (SObject)(Type.forName('Schema.'+ strObjectApiName).newInstance());
            List<Schema.FieldSetMember> lstFSMember = 
                sObj.getSObjectType().getDescribe().fieldSets.getMap().get(strfieldSetName).getFields();

	    //prepare SOQL query based on fieldAPIs	
	    String query = 'SELECT ';
	    for(Schema.FieldSetMember f : lstFSMember) {
	        query += f.getFieldPath() + ', ';
            }
            query += 'Id FROM ' + strObjectApiName ;

            //Just in case criteria field not specified then it will return all records
            if(!(String.isEmpty(criteriaField) && String.isEmpty(criteriaFieldValue))){
                query += ' WHERE ' + criteriaField + '=\'' + string.escapeSingleQuotes(criteriaFieldValue) + '\'';
            }
                        
	    //execute query
             system.debug('soql == '+query);

             List<SObject> lstRecords = Database.query(query);
             system.debug('lstRecords == '+lstRecords);
            
             //prepare a map which will hold fieldList and recordList and return it
	     returnMap.put('FIELD_LIST', JSON.serialize(lstFSMember));
	     returnMap.put('RECORD_LIST', JSON.serialize(lstRecords));
         system.debug('JSON.serialize(returnMap) == '+JSON.serialize(returnMap.get('FIELD_LIST')));
	     return JSON.serialize(returnMap);
        }
        return null;
    }


    // Apex method to load contacts on an account record.
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accId) {
        return [
            SELECT AccountId, Id, FirstName, LastName, Title, Phone, Email
            FROM Contact
            WHERE AccountId = :accId
            WITH SECURITY_ENFORCED
        ];
    }

    //method to update contacts
    @AuraEnabled
    public static string updateContacts(Object data) {
        List<Contact> contactsForUpdate = (List<Contact>) JSON.deserialize(
            JSON.serialize(data),
            List<Contact>.class
        );
        try {
            update contactsForUpdate;
            return 'Success: contacts updated successfully';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }

    //method to generate pdf
    @AuraEnabled
    public static ContentVersion generatePDF(String txtValue){
        
        Pagereference pg = Page.renderAsPDF;
        pg.getParameters().put('displayText', txtValue);

        
        Contact con = [select id from Contact limit 1];
        
        /*
        Attachment objAttachment = new Attachment();
        objAttachment.Name = 'J2S.pdf';
        objAttachment.ParentId = con.Id;
        objAttachment.Body = pg.getContentaspdf();   
        objAttachment.IsPrivate = false;
        insert objAttachment;
        return objAttachment;
        */

        // inserting file
        ContentVersion cv = new ContentVersion();
        cv.Title = 'J2S.pdf';
        cv.PathOnClient = '/' + 'J2S.pdf';
        cv.FirstPublishLocationId = con.Id;
        cv.VersionData = pg.getContentaspdf();
        cv.IsMajorVersion = true;
        Insert cv;
        cv = [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE id =: cv.id];
        return cv;
    }
}
