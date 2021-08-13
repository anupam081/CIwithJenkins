public with sharing class listViewButtonController {
    public List<Lead> opportunities{get;private set;}
    public String filterId {get;set;}
    public listViewButtonController(ApexPages.StandardSetController stdSetController) {
        // Returns all selected records
        opportunities = (List<Lead>) stdSetController.getSelected();
        filterId = stdSetController.getFilterId();
    }

    public PageReference save(){
        // Some fancy stuff here.
        try{
         update opportunities;
        } catch(Exception e){
            System.debug('Exception: ' + e);
        }
        return null;
    }
}
