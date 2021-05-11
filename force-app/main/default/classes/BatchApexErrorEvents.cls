public with sharing class BatchApexErrorEvents {
    
    private List<BatchApexErrorEvent> events;

    public BatchApexErrorEvents(List<BatchApexErrorEvent> events) {
        this.events = events;
    }

    public void handle() {
        // Query associated AsyncApexJobs
        Set<Id> asyncApexJobIds = new Set<Id>();
        for(BatchApexErrorEvent evt : events){
            asyncApexJobIds.add(evt.AsyncApexJobId);
        }    
    }
}
