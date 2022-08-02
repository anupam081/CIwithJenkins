import { LightningElement, track} from 'lwc';
import chartjs from '@salesforce/resourceUrl/Chartjs';
import getCoverageCSVandJSON from '@salesforce/apex/CodeCoverageResult.getCoverageCSVandJSON'
import { loadScript } from 'lightning/platformResourceLoader';

export default class CodeCoverageView extends LightningElement {

    @track hasRendered = false;
    @track chartjs = chartjs;
    @track coverageJSON;
    @track barChartData = {};
    @track coverageJSONPage = [];
    @track coverageCSV = '';
    @track isLoading = true;
    @track style = 'height:200px;';
    barChart;
    error;

    renderedCallback() {
        if (this.hasRendered) {
            return;
        }
        this.hasRendered = true;
        Promise.all([
            loadScript(this, this.chartjs)
        ]).then(() => {
            this.generateBarChart();
        })
        .catch(error => {
            this.error = error;
            console.log(' Error Occured ', error);
        });
    }

    errorCallback(error, stack) {
        this.error = error;
        console.log(' this.error ', this.error);
    }

    generateBarChart() {
        getCoverageCSVandJSON().then(result => { 
            var resultJson = JSON.parse(result);
            this.coverageJSON = resultJson.jsonData;
            this.coverageCSV = resultJson.csvData;
        })
        .catch(error => {
            this.error = error;
        });
    }

    prepareGraphData() {
        if (this.barChart) {
            this.barChart.destroy();
        }
        var classLabels = [];
        var covered = [];
        var notcovered = [];
        for (var index in this.coverageJSONPage) {
                var coverageData = this.coverageJSONPage[index];
                classLabels.push(coverageData.ClassName);
                covered.push(coverageData.Coverage);
                notcovered.push(coverageData.RemainingCoverage);
        }

        this.barChartData = {
            labels : classLabels,
            datasets: [{
                label: 'Covered(%)',
                backgroundColor: 'rgba(126, 222, 31, 0.5)',
                data: covered
            },
            {
                label: 'Not Covered(%)',
                backgroundColor: 'rgba(237, 108, 57, 0.5)',
                data: notcovered
            }]
        };

        var dataSet = {
            type: 'horizontalBar',
            data: this.barChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Unit Test Coverage'
                },
                tooltips: {
                    mode: 'index',
                    intersect: true
                },
                scaleShowValues: true,
                scales: {
                    yAxes: [{
                        stacked: true,
                        categoryPercentage: 1.0,
                        barPercentage: 0.5,
                        ticks: {
                            autoSkip: false
                        }
                    }],
                    xAxes: [{
                        type: 'linear',
                        display: true,
                        position: 'left',
                        stacked: true
                    }],
                }
            }
        }

        this.isLoading = false;

       this.style = 'height:'+(this.coverageJSONPage.length * 30) + 'px;';
        

        const ctx = this.template
            .querySelector('canvas.barChart')
            .getContext('2d');

        this.barChart = new window.Chart(ctx, dataSet);

    }

    downloadAsCsvFile(event) {
        let fileName = 'UnitTestCodeCoverage.csv';
        let downloadElement = document.createElement('a');
        downloadElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(this.coverageCSV);
        downloadElement.target = '_blank';
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click(); 
    }

    handleDataUpdate(event){
        this.coverageJSONPage = event.detail;
        this.prepareGraphData();
    }

}