export function exportCSVFile(totalData, fileTitle){
    if(!totalData || !totalData.length){
        return null
    }

    const jsonObject = JSON.stringify(totalData)
    const result = convertToCSV(jsonObject)
    if(result === null) return
    const blob = new Blob([result])
    const exportedFilename = fileTitle ? fileTitle+'.csv' :'export.csv'
    if(navigator.msSaveBlob){
        navigator.msSaveBlob(blob, exportedFilename)
    } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)){
        const link = window.document.createElement('a')
        link.href='data:text/csv;charset=utf-8,' + encodeURI(result);
        link.target="_blank"
        link.download=exportedFilename
        link.click()
    } else {
        const link = document.createElement("a")
        if(link.download !== undefined){
            const url = URL.createObjectURL(blob)
            link.setAttribute("href", url)
            link.setAttribute("download", exportedFilename)
            link.style.visibility='hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }
    

}
function convertToCSV(objArray){

    const data = typeof objArray !=='object' ? JSON.parse(objArray):objArray;
    const columnDelimiter = ','
    const lineDelimiter = '\r\n'
    const actualHeaderKey = getHeaderValues(data); // get all headers from the data array
    //const actualHeaderKey = Object.keys(headers)
    //const headerToShow = Object.values(headers) 
    let str = ''
    str+=actualHeaderKey.join(columnDelimiter) 
    str+=lineDelimiter
    
    data.forEach(obj=>{
        let line = ''
        actualHeaderKey.forEach(key=>{
            if(line !=''){
                line+=columnDelimiter
            }
            let strItem = obj[key]+''
            line+=strItem? strItem.replace(/,/g, ''):strItem
        })
        str+=line+lineDelimiter
    })
    console.log("str", str)
    return str
}

// get all header values from the data
function getHeaderValues(datarecord){
    
    var actualHeaderKey = [];

    datarecord.forEach(item => {
        if(actualHeaderKey.length <= Object.keys(item).length){
            actualHeaderKey = [...Object.keys(item)];
        }              
    });

    console.log('DATA HEADERS = '+actualHeaderKey);    
    
    //const actualHeaderKey = Object.keys(data[0]); // get all headers from the data array
    return actualHeaderKey;
}