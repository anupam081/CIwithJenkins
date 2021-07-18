public with sharing class DisplayPDFController {

    public String displayText {get; set;}
    public DisplayPDFController() {
        String disText = ApexPages.currentPage().getParameters().get('displayText');
        displayText = String.escapeSingleQuotes(disText);
    }
}