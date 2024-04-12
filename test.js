const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function runTests() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // Test navigation to main pages
    await driver.get("http://localhost:8000");
    await driver.findElement(By.partialLinkText("About")).click();
    await driver.wait(until.urlIs("http://localhost:8000/about"), 5000);
    await driver.navigate().back();
    await driver.findElement(By.linkText("FAQ")).click();
    await driver.wait(until.urlIs("http://localhost:8000/faq"), 5000);
    await driver.navigate().back();

    // Product display test
    await driver.findElement(By.linkText("All Flowers")).click();
    await driver.wait(until.urlIs("http://localhost:8000/allflowers"), 5000);

    // Test Login
    await driver.get("http://localhost:8000/login");
    await driver.findElement(By.id("username")).sendKeys("Smith1");
    await driver.findElement(By.id("password")).sendKeys("123qwe");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs("http://localhost:8000/dashboard"), 5000);

    // Test Add flowers to basket
    await driver.findElement(By.linkText("All Flowers")).click();
    await driver.get("http://localhost:8000/allflowers");

    // Select the third product (index 2) and add 1 to the quantity
    const productIndex = 2;
    await driver
      .findElement(
        By.css(
          ".ecua-container > .ecua-item:nth-child(" +
            (productIndex + 1) +
            ') input[name="quantity"]'
        )
      )
      .sendKeys("1");
    await driver
      .findElement(
        By.css(
          ".ecua-container > .ecua-item:nth-child(" +
            (productIndex + 1) +
            ') button[type="submit"]'
        )
      )
      .click();

    await driver.wait(until.urlContains("/basket"), 5000);

    await driver.findElement(By.id("houseFlatNumber")).sendKeys("123");
    await driver.findElement(By.id("addressLine1")).sendKeys("London Street");
    await driver.findElement(By.id("addressLine2")).sendKeys("albion Road");
    await driver.findElement(By.id("postcode")).sendKeys("SE45 9TF");

    // card message
    await driver
      .findElement(By.id("cardMessage"))
      .sendKeys("Happy Mother's Day");

    // User feedback testing
    await driver.findElement(By.linkText("Add Comments")).click();
    await driver.wait(until.urlIs("http://localhost:8000/add_comments"), 5000);
    await driver
      .findElement(By.id("comment_text"))
      .sendKeys("This is a Selenium test comment");

    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs("http://localhost:8000/comments"), 5000);

    await driver.findElement(By.linkText("My Flowers")).click();

    await driver.findElement(By.linkText("Logout")).click();

    console.log("All tests passed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await driver.quit();
  }
}

runTests();
