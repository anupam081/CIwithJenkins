public class sampleJob implements Database.Batchable<SObject>, batchErrorHandler {
    
    
    public List<Contact> start(Database.BatchableContext ctx) {
        system.debug('I am in handle start');
        return [select Id, Email from Contact where Email != null ];
    }

    public void execute(Database.BatchableContext ctx, List<SObject> scope) {
        system.debug('I am in handle execute');
        List<Contact> contactss = new List<Contact>();
        for(SObject s : scope){
            Contact con = (Contact)s;
            con.Email = con.Email + '.Uat';
            contactss.add(con);
        }

        update contactss;
    }

    public void finish(Database.BatchableContext ctx) { 
        system.debug('I am in finish');
        handleErrors(ctx);
    }

    public void handleErrors(Database.BatchableContext ctx) {
        system.debug('I am in handle errors');
    }
    
}
