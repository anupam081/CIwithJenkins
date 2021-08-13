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


    @AuraEnabled
    public static String uploadFile(String base64, String filename, String recordId) {
          ContentVersion cv = createContentVersion(base64, filename);
          ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
          if (cv == null || cdl == null) { return null; }
          return cdl.Id;
    }

    private static ContentVersion createContentVersion(String base64, String filename) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        try {
          insert cv;
          return cv;
        } catch(DMLException e) {
            System.debug(e);
            return null;
        }
      }

      private static ContentDocumentLink createContentLink(String contentVersionId, String recordId) {
            if (contentVersionId == null || recordId == null) { return null; }
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.ContentDocumentId = [
                SELECT ContentDocumentId 
                FROM ContentVersion 
                WHERE Id =: contentVersionId
                ].ContentDocumentId;
                cdl.LinkedEntityId = recordId;
                // ShareType is either 'V', 'C', or 'I'
                // V = Viewer, C = Collaborator, I = Inferred
                cdl.ShareType = 'V';
            try {
                insert cdl;
                return cdl;
            } catch(DMLException e) {
                System.debug(e);
                return null;
            }
       }

      /**Apex method to read csv file */
       @AuraEnabled
       public static list<Account> csvFileRead(Id contentDocumentId){
           list<Account> accountInsertList = new list<Account>();
           if(contentDocumentId != null) {
               
               // Fetch File Data based on the basic of document id 
               ContentVersion contentVersionObj = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:contentDocumentId];
               // split the file data
               list<String> csvRecordsList = contentVersionObj.VersionData.toString().split('\n');
   
               for(Integer i = 1; i < csvRecordsList.size(); i++){
                   Account accountObj = new Account();
                   list<String> csvRowData = csvRecordsList[i].split(',');
                   System.debug('csvRowData====> '+csvRowData);
                   accountObj.Name = csvRowData[0]; // accName
                   accountObj.AccountSource = csvRowData[1];
                   accountObj.Site = csvRowData[2];
                   accountObj.Type = csvRowData[3];
                   accountObj.Website = csvRowData[4];
                   accountInsertList.add(accountObj);
               }
   
               try{    
                   if(!accountInsertList.isEmpty()) {
                       insert accountInsertList;
                   }
               }
               catch (Exception ex) {
                   throw new AuraHandledException(ex.getMessage());
               } 
           }
           return accountInsertList;    
       }

       @AuraEnabled(cacheable=true)
       public static List<Account> getAccounts() {
           return [SELECT Id, Name, AnnualRevenue, Industry, Phone from Account];
       }

     @AuraEnabled
    public static List<sObject> search(String objectName, List<String> fields, String searchTerm){
        String searchKeyword = searchTerm + '*';
        String returningQuery = '';
        returningQuery = objectName+' ( Id, '+String.join(fields,',')+')';
        String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 20';
        System.debug(' query '+query);
        List<List<sObject>> searchRecords = Search.Query(Query);
        return searchRecords.get(0);
    }
}
