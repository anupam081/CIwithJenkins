public with sharing class RatingCtrl {
    public List<wrapperInput> header2Val { get; set; }
    //public Map<String, Integer> header2ValMap {get; set;}
    
    public RatingCtrl() {
        header2Val  = new List<wrapperInput>();
        header2Val.add(new wrapperInput('Hardware'));
        header2Val.add(new wrapperInput('Software'));        

    }

    public class wrapperInput{
        public Integer rating { get; set; }
        public String header {get;set;}

        public wrapperInput(String header){
            this.header = header;
        }
    }
}
