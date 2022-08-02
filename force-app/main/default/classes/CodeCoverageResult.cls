public class CodeCoverageResult {
    /*
    * @Name : - fetchSessionIdFromVF
    * @Description: - Get the Log In Use Session Id from VF Page
    * @Params : - none
    * @ReturnType : - String
    */
    public static String fetchUserSessionId(){
        String sessionId = '';
        PageReference reportPage = Page.GetSessionIdVF;
        String vfContent = reportPage.getContent().toString();
        System.debug('vfContent '+vfContent);
        
        // Find the position of Start_Of_Session_Id and End_Of_Session_Id
        Integer startP = vfContent.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length(),
        endP = vfContent.indexOf('End_Of_Session_Id');
        
        // Get the Session Id
        sessionId = vfContent.substring(startP, endP);
        
        // Return Session Id
        return sessionId;
    }
    /*
    * @Name - getCoverage
    * @Description - getCoverage by making API Call out
    * @params - None
    * @ReturnType - String
    */
    public static string getCoverage(){
        String baseURL =  'https://' + System.URL.getSalesforceBaseUrl().getHost();
        string queryStr = 'SELECT+NumLinesCovered,ApexClassOrTriggerId,ApexClassOrTrigger.Name,NumLinesUncovered,Coverage+FROM+ApexCodeCoverageAggregate';
        String endPoint = baseURL + '/services/data/v40.0/tooling/query/?q=' + queryStr;
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endPoint);
        req.setHeader('Authorization', 'Bearer ' + fetchUserSessionId());
        req.setHeader('Content-Type', 'application/json');
        req.setMethod('GET');
        req.setTimeout(80000);
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
        
        return res.getBody();
    }
    /*
    * @Name - getCoverageCSVandJSON
    * @Description - getCoverage in CSV & JSON format
    * @params - None
    * @ReturnType - String
    */
    @AuraEnabled
    public static String getCoverageCSVandJSON(){
        
        String coverageResponse = getCoverage();
        
        Map<String, Object> coverageJson =(Map<String, Object>)JSON.deserializeUntyped(coverageResponse); 
        String rowEnd = '\n';
        String separator = ',';
        String csvString = '';
        List<Map<String, Object>> coverageData = new List<Map<String, Object>>();
        csvString += 'ClassName' + separator 
            + 'Coverage(%)' + separator 
            + 'Lines Covered' + separator 
            + 'Remaining Coverage (%)' + rowEnd;
        
        List<Object> coverageRecs = (List<Object>)coverageJson.get('records');
        for (Object coverageRec: coverageRecs) {
            Map<String, Object> coverageRecMap = (Map<String, Object>)coverageRec;
            Map<String, Object> coverageClass = (Map<String, Object>)coverageRecMap.get('ApexClassOrTrigger');
            String className = String.valueOf(coverageClass.get('Name'));
            Integer linesCovered = Integer.valueOf(coverageRecMap.get('NumLinesCovered'));
            Integer linesUncovered  = Integer.valueOf(coverageRecMap.get('NumLinesUncovered'));
            Decimal totalLines = linesCovered != null ? linesCovered : 0  + linesUncovered != null ? linesUncovered : 0;
            Decimal coveragePercent = (totalLines == 0)? 0 : ((linesCovered / totalLines)*100).setScale(2);
            String coverage = linesCovered + ' out of ' + totalLines;
            Decimal coveragePotential = (100-coveragePercent).setScale(2);
            csvString += className + separator;
            csvString += coveragePercent + separator;
            csvString += coverage + separator;
            csvString += coveragePotential + rowEnd;
            coverageData.add(new Map<String, Object>{
                'ClassName' =>  className,
                'Coverage' => coveragePercent, 
                'LinesCovered' => linesCovered,
                'LinesNotCovered'=> linesUncovered,
                'RemainingCoverage' => coveragePotential
            });
        }
        
        Map<String, Object> csvAndJsonData = new Map<String, Object>{
            'csvData' => csvString,
            'jsonData'=> coverageData
        };
        
        return JSON.serialize(csvAndJsonData);
    }
}