trigger BatchApexErrorEventsTrigger on BatchApexErrorEvent (after insert) {
    new BatchApexErrorEvents(Trigger.new).handle(); 
}