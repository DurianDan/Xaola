import { PuppetMaster } from "../src/ThePuppetShow/PuppetMaster"
import { debugLaunchOptions, defaultLaunchOptions } from "../src/TheSalesman/config/browser";
import initPuppet from "../src/initPupper"

describe("Check ScrapedElement", ()=>{
    let puppetMaster: PuppetMaster;

    beforeAll(async () => {
        const { page, browser } = await initPuppet(defaultLaunchOptions);
        puppetMaster = new PuppetMaster(page, browser);
    });

    afterAll(async () => {
        await puppetMaster.close();
    });

    const githubAccount = "https://github.com/DurianDan";
    const githubAccountNameXpath = '//span[@class="p-name vcard-fullname d-block overflow-hidden"]';
    const tabsXpath = '//nav[@aria-label="User profile"]/a[*]';
    let expectedTabHrefTexts = [
        ["Overview", githubAccount],
        ["Repositories", githubAccount+ "?tab=repositories"],
        ["Projects", githubAccount+ "?tab=projects"],
        ["Packages", githubAccount+ "?tab=packages"],
        ["Stars", githubAccount+ "?tab=stars"]
    ].map((href, text) => {return {href, text}});

    test("1. text()", async ()=>{
        await puppetMaster.goto(githubAccount);
        const extractedNameElement = await puppetMaster.xpathElement(githubAccountNameXpath)
        expect((await extractedNameElement.text()).trim()).toBe("Huy Vu Nguyen")
    })
    test("2. getAttribute()", async ()=>{
        await puppetMaster.goto(githubAccount);
        const tabsElement = await puppetMaster.xpathElements(tabsXpath)
        const extractedTabHrefTexts = await Promise.all(
            (
                tabsElement.slice(0,5).map(async ele => { // choose only the first 5 elements because they are duplicated after that.
                    const rawHrefTexts = await ele.hrefAndText();
                    // Some tab names contain dynamic numbers => remove them using `split`,
                    rawHrefTexts.text = rawHrefTexts.text.split("\n")[0].trim()
                    return rawHrefTexts
                })
            )
        )
        expect(extractedTabHrefTexts).toBe(expectedTabHrefTexts)
    })
    test("3. href()", async ()=>{
        await puppetMaster.goto(githubAccount);
        const overViewElement = await puppetMaster.xpathElement(tabsXpath)
        expect((await overViewElement.href())).toBe(githubAccount);
    })
    test("4. hrefAndText()", async ()=>{
        await puppetMaster.goto(githubAccount);
        const overViewElement = await puppetMaster.xpathElement(tabsXpath)
        expect((await overViewElement.hrefAndText())).toBe({href: githubAccount, text: "Overview"});
    })
})

// test('Check `PuppetMaster` Functions', async () => {
    

//     let extractedGithubAccountName = null;
//     let expectedGithubAccountName = "Huy Vu Nguyen";

//     let extractedTabHrefTexts: {href: string, text: string}[] = [];
//     let expectedTabHrefTexts = [
//         ["Overview", githubAccount],
//         ["Repositories", githubAccount+ "?tab=repositories"],
//         ["Projects", githubAccount+ "?tab=projects"],
//         ["Packages", githubAccount+ "?tab=packages"],
//         ["Stars", githubAccount+ "?tab=stars"]
//     ].map((href, text) => {return {href, text}});

//     try{
//         await puppetMaster.goto(githubAccount)
//         const nameElement = await puppetMaster.xpathElement(githubAccountNameXpath)
//         extractedGithubAccountName = (await nameElement.text()).trim()

//         const tabsElement = await puppetMaster.xpathElements(tabsXpath)
//         extractedTabHrefTexts = await Promise.all(
//             (
//                 tabsElement.slice(0,5).map(async ele => { // choose only the first 5 elements because they are duplicated after that.
//                     const rawHrefTexts = await ele.hrefAndText();
//                     // Some tab names contain dynamic numbers => remove them using `split`,
//                     rawHrefTexts.text = rawHrefTexts.text.split("\n")[0].trim()
//                     return rawHrefTexts
//                 })
//             )
//         )
//     }finally{
//         await browser.close();
//     }
//     expect(extractedGithubAccountName).toBe(expectedGithubAccountName);
//     expect(extractedTabHrefTexts).toBe(expectedTabHrefTexts)
// }, 10000)