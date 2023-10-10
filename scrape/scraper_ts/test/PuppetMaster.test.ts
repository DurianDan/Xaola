import { PuppetMaster } from "../src/ThePuppetShow/PuppetMaster"
import initPuppet from "../src/initPupper"

test('Check PuppetMaster', async () => {
    const { page, browser } = await initPuppet({
        headless: true,
        args: [
            '--no-sandbox',
            '--incognito',
            '--headless=new'
        ],
    });
    const puppetMaster = new PuppetMaster(page, browser)
    await puppetMaster.goto("https://google.com")
    const bodyElement = await puppetMaster.xpathElement('/html/body') 
    const allText = await bodyElement.text()
    await browser.close()
    expect(allText.toLowerCase().includes("google")).toBe(true);
})