import { LightningElement, api, track} from 'lwc';

const startingPage = 1;
export default class lwcPaginator extends LightningElement {
    @api rowsperpageoptions = [5,10,20,50,100];
    @api allrecords = [];
    @api pagesize;
    @track totalPages;
    @track pageNumber = startingPage;
    @track hasPrevious = false;
    @track hasNext = false;
    recordsOnPage = [];

    connectedCallback() {
        this.pagesize = this.rowsperpageoptions[0];
        this.filterRecordsOnPage();
    }

    handleRowsPerPageChange(event){
        this.pagesize = event.target.value;
        this.pageNumber = startingPage;
        this.filterRecordsOnPage();
    }
    hanldePreviousPage(){
        this.pageNumber = this.pageNumber-1;
        this.filterRecordsOnPage();
    }
    hanldeNextPage(){
        this.pageNumber = this.pageNumber+1;
        this.filterRecordsOnPage();
    }
    filterRecordsOnPage(){
        this.recordsOnPage = [];

        this.totalPages = Math.ceil(this.allrecords.length/this.pagesize);
        if(this.totalPages < 1){
            this.totalPages = 1;
        }

        if(this.pageNumber > 1){
            this.hasPrevious = true;
        }
        else{
            this.hasPrevious = false;
        }

        if(this.pageNumber < this.totalPages){
            this.hasNext = true;
        }
        else{
            this.hasNext = false;
        }
        let pageRecStartIndex = (this.pageNumber-1)*this.pagesize;
        let pageRecEndIndex = (this.pageNumber*this.pagesize);
        this.recordsOnPage = this.allrecords.slice(pageRecStartIndex, pageRecEndIndex);

        this.dispatchEvent(new CustomEvent('pagedataupdate', {detail: this.recordsOnPage}));
    }
}