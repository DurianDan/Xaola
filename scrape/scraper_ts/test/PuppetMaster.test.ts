import { PuppetMaster } from "../src/ThePuppetShow/PuppetMaster"
import { debugLaunchOptions } from "../src/TheSalesman/config/browser";
import initPuppet from "../src/initPupper"

test('Check `PuppetMaster` Functions', async () => {
    const { page, browser } = await initPuppet(debugLaunchOptions);
    const githubAccount = "https://github.com/DurianDan";
    const githubAccountNameXpath = '//span[@class="p-name vcard-fullname d-block overflow-hidden"]';
    const tabsXpath = '//nav[@aria-label="User profile"]/a[*]';

    let extractedGithubAccountName = null;
    let expectedGithubAccountName = "Huy Vu Nguyen";

    let extractedTabHrefTexts: {href: string, text: string}[] = [];
    let expectedTabHrefTexts = [
        ["Overview", githubAccount],
        ["Repositories", githubAccount+ "?tab=repositories"],
        ["Projects", githubAccount+ "?tab=projects"],
        ["Packages", githubAccount+ "?tab=packages"],
        ["Stars", githubAccount+ "?tab=stars"]
    ].map((href, text) => {return {href, text}});

    try{
        const puppetMaster = new PuppetMaster(page, browser)
        await puppetMaster.goto(githubAccount)
        const nameElement = await puppetMaster.xpathElement(githubAccountNameXpath)
        extractedGithubAccountName = (await nameElement.text()).trim()

        const tabsElement = await puppetMaster.xpathElements(tabsXpath)
        extractedTabHrefTexts = await Promise.all(
            (
                tabsElement.slice(0,5).map(async ele => { // choose only the first 5 elements because they are duplicated after that.
                    const rawHrefTexts = await ele.hrefAndText();
                    // Some tab names contain dynamic numbers => remove them using `split`,
                    rawHrefTexts.text = rawHrefTexts.text.split("\n")[0].trim()
                    return rawHrefTexts
                })
            )
        )
    }finally{
        await browser.close();
    }
    expect(extractedGithubAccountName).toBe(expectedGithubAccountName);
    expect(extractedTabHrefTexts).toBe(expectedTabHrefTexts)
}, 10000)