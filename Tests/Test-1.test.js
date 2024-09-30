const { baseUrl, timeoutTest } = require("../config");
const BasePageFunctions = require("../Pages/BasePageFunctions");
const LoginPage = require("../Pages/LoginPage")
const ProductsPage = require("../Pages/ProductsPage")
const GeneralFunctions = require("../Pages/GeneralFunctions");
const YourCartPage = require("../Pages/YourCartPage");
const CheckoutPage = require("../Pages/CheckoutPage");
const { NormalAccount, Password } = require("../TestData/Accounts");
const { ExpectedResults } = require("../TestData/Test-1-Data").Test1Data;
const loggerFactory = require("../Logger/Logger");
const { assert } = require("chai");
const testName = "Test-1";
const { startRecording, stopRecording } = require("../VideoRecorder/videoRecorder");

describe(testName, function () {
    let basePageFunctions, loginPage, productsPage, generalFunctions, yourCartPage, checkoutPage;
    let logger = loggerFactory(testName)

    before(async function () {
        this.timeout(timeoutTest);
        logger.startLoggin(testName);
        basePageFunctions = new BasePageFunctions(logger);
        await basePageFunctions.launchBrowser();
        loginPage = new LoginPage(logger, basePageFunctions.getPage())
        productsPage = new ProductsPage(logger, basePageFunctions.getPage())
        generalFunctions = new GeneralFunctions(logger, basePageFunctions.getPage())
        yourCartPage = new YourCartPage(logger, basePageFunctions.getPage())
        checkoutPage = new CheckoutPage(logger, basePageFunctions.getPage())
        // await startRecording(await basePageFunctions.getPage(), testName);
    });

    after(async function () {
        this.timeout(timeoutTest);
        await basePageFunctions.quit();
        // await stopRecording();
        logger.endLoggin(testName);
    });

    it("Complete Order - Empty Information Form - Fail", async function () {
        this.timeout(timeoutTest);
        await basePageFunctions.openUrl(baseUrl);
        await basePageFunctions.setFullscreen();
        await loginPage.login(NormalAccount.Username, Password);
        await productsPage.selectRandomProduct();
        await generalFunctions.clickCart();
        await yourCartPage.pressCheckout();
        await checkoutPage.pressContinue();
        const actualResult = await checkoutPage.getErrorMessage();
        assert.equal(actualResult, ExpectedResults.ErrorMessage);
    });
});
