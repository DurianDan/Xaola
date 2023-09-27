interface BaseScrapedTable{
    id: Number,
    createdOn: Date|null,
    _eqFields: Array<string>
}

function checkEqFields(
    row: BaseScrapedTable,
    otherRow: BaseScrapedTable
): void{
    for  
}

function implements (row: BaseScrapedTable, otherRow: BaseScrapedTable): boolean{
    return Object.keys(row).every((field)=>{
        otherRow[field] === row[field]
    })
}
