const ld_diff = require('lodash.difference');

interface BaseScrapedTable{
    id: Number,
    createdOn: Date|null,
    _eqFields: Array<string>
}

function checkEqFields(
    row: BaseScrapedTable,
    otherRow: BaseScrapedTable
): void{
    for (const rowPair of [[row, otherRow],[otherRow, row]]){
        const unmatchedFields: Array<string>= ld_diff.difference(
            Object.keys(rowPair[0]),
            Object.keys(rowPair[1])
        );
        if (unmatchedFields.length > 0){
            throw "unmatched fields: " + unmatchedFields
        }
    }
}

function isEqual (row: BaseScrapedTable, otherRow: BaseScrapedTable): boolean{
    checkEqFields(row, otherRow);
    return row._eqFields.every((field): boolean => {
        return ((row as any)[field] === (row as any)[field])
    })
}
