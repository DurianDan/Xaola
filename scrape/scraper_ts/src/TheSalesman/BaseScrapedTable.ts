import { difference as arrDiff } from 'lodash';

class BaseScrapedTable {
    public _eqFields: string[] = ['shopify_page'];

    constructor(
        public id: number | null = null,
        public createdOn: Date,
    ) {
        this.id = id;
        this.createdOn = createdOn;
    }

    /**
     * Check if 2 `BaseScrapedTable` can be compared, based on their `_eqFields`
     * @param row:BaseScrapedTable
     * @param otherRow:BaseScrapedTable
     * @throws "unmatched fields: " + `unmatchedFields`
     */
    checkEqFields(otherRow: BaseScrapedTable): void {
        for (const rowPair of [
            [this, otherRow],
            [otherRow, this],
        ]) {
            const unmatchedFields: Array<string> = arrDiff(
                Object.keys(rowPair[0]),
                Object.keys(rowPair[1]),
            );
            if (unmatchedFields.length > 0) {
                throw new Error(
                    'Unmatched fields: ' + unmatchedFields.join(', '),
                );
            }
        }
    }

    /**
     * Compare 2 `BaseScrapedTable`, if they are equal, based on their _eqFields
     * @param row:BaseScrapedTable
     * @param other:BaseScrapedTable
     * @returns true if the 2 obj are equal, false if otherwise
     */
    isEqual(other: BaseScrapedTable): boolean {
        this.checkEqFields(other);
        return this._eqFields.every((field): boolean => {
            return (this as any)[field] === (this as any)[field];
        });
    }
}

export default BaseScrapedTable;
