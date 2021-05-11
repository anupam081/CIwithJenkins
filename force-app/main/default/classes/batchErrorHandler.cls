public interface batchErrorHandler extends Database.RaisesPlatformEvents  {
    
    void handleErrors(Database.BatchableContext bc);
}
