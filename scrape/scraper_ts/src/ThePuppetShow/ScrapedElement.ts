import { ElementHandle, JSHandle } from 'puppeteer';

class ScrapedElement {
    constructor(
        public element: ElementHandle,
        public selector: string,
    ) {
        this.element = element;
        this.selector = selector;
    }
    async getProperty(propertyName: string): Promise<string> {
        const valueHandle: JSHandle =
            await this.element.getProperty(propertyName);
        const propertyValue = (await valueHandle.jsonValue()) as string;

        if (propertyValue) {
            return propertyValue;
        } else {
            throw new Error(
                `Cant get attribute "${propertyName}", it might not exist!!!`,
            );
        }
    }
    async text(): Promise<string> {
        return await this.getProperty('textContent');
    }
    async href(): Promise<string> {
        return await this.getProperty('href');
    }
    async hrefAndText(): Promise<{ href: string; text: string }> {
        const href = await this.href();
        const text = await this.text();
        return { href, text };
    }
}

export default ScrapedElement;
