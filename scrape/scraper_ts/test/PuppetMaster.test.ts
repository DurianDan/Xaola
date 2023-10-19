import { PuppetMaster } from "../src/ThePuppetShow/PuppetMaster"
import { debugLaunchOptions } from "../src/TheSalesman/config/browser";
import initPuppet from "../src/initPupper"

let puppetMaster: PuppetMaster;
const timeLimit = 20000;
const githubAccount = "https://github.com/DurianDan";
const githubAccountNameXpath = '//span[@class="p-name vcard-fullname d-block overflow-hidden"]';
const tabsXpath = '/html/body/div[1]/div[4]/main/div[1]/div/div/div[2]/div/nav/a[*]';
let expectedTabHrefTexts = [
    ["Overview", githubAccount ],
    ["Repositories", githubAccount + "?tab=repositories"],
    ["Projects", githubAccount + "?tab=projects"],
    ["Packages", githubAccount + "?tab=packages"],
    ["Stars", githubAccount + "?tab=stars"]
].map(([text, href]) => {return {href, text}});

beforeAll(async() => {
    const {page, browser} = await initPuppet(debugLaunchOptions);
    puppetMaster = new PuppetMaster(page, browser);
    await puppetMaster.goto(githubAccount);
}, timeLimit)

afterAll(async () => {await puppetMaster.close()})

test("1. xpathElement()", async()=>{
    const extractedNameElement = await puppetMaster.xpathElement(githubAccountNameXpath)
    const extractedName = (await extractedNameElement.text()).trim()
    expect(extractedName).toBe("Huy Vu Nguyen")
}, timeLimit)

test("2. getProperty() => hrefAndTexts()", async()=>{
    const tabsElement = await puppetMaster.xpathElements(tabsXpath)
    const extractedTabHrefTexts = await Promise.all(
        (
            tabsElement.map(async ele => { // choose only the first 5 elements because they are duplicated after that.
                const rawHrefTexts = await ele.hrefAndText();
                // Some tab names contain dynamic numbers => remove them using `split`,
                rawHrefTexts.text = rawHrefTexts.text.trim().split("\n")[0]
                return rawHrefTexts
            })
        )
    )
    expect(extractedTabHrefTexts).toStrictEqual(expectedTabHrefTexts)
}, timeLimit)

test("3. href()",async() => {
    const overViewElement = await puppetMaster.xpathElement(tabsXpath)
    expect(await overViewElement.href()).toBe(githubAccount);
}, timeLimit)

test("4. hrefAndText()", async() => {
    const overViewElement = await puppetMaster.xpathElement(tabsXpath)
    let hrefText = await overViewElement.hrefAndText()
    hrefText.text = hrefText.text.trim();
    expect(hrefText).toStrictEqual({href: githubAccount, text: "Overview"});
}, timeLimit)