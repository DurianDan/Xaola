import * as lodash from 'lodash';

class BaseScrapedTable {
    public _eqFields: string[] = ['shopify_page'];

    constructor(
        public scrapedAt: Date,
        public id?: number | string,
    ) {
        this.id = id;
        this.scrapedAt = scrapedAt;
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
            const unmatchedFields: Array<string> = lodash.difference(
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
     * Compare 2 `BaseScrapedTable`, if they are equal, based on their `_eqFields`
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

    /**
     * Check if the ScrapedTable is a valid object => actually contains crucial information => ready to be compared with this.isEqual()
     * @returns {any}
     */
    isValid(): boolean {
        for (const fieldName in this._eqFields) {
            const tmpValue = (this as any)[fieldName];
            if (!tmpValue || lodash.isEmpty(tmpValue)) {
                return false;
            }
        }
        return true;
    }

    removeNullUndefinedFields<T>(obj: T): T {
        const newObj: T = {} as T;

        for (const key in obj) {
            if (obj[key] !== null && obj[key] !== undefined) {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    }
}

export default BaseScrapedTable;
