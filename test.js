const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");

async function runTests() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // Prueba de navegación a páginas principales
    // Test navigation to main pages
    await driver.get("http://localhost:8000");
    await driver.findElement(By.partialLinkText("About")).click();
    await driver.wait(until.urlIs("http://localhost:8000/about"), 5000);
    await driver.navigate().back();
    await driver.findElement(By.linkText("FAQ")).click();
    await driver.wait(until.urlIs("http://localhost:8000/faq"), 5000);
    await driver.navigate().back();

    // Prueba de visualización de productos
    await driver.findElement(By.linkText("All Flowers")).click();
    await driver.wait(until.urlIs("http://localhost:8000/allflowers"), 5000);

    // Prueba de inicio de sesión
    await driver.get("http://localhost:8000/login");
    await driver.findElement(By.id("username")).sendKeys("Smith1");
    await driver.findElement(By.id("password")).sendKeys("123qwe");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs("http://localhost:8000/dashboard"), 5000);

    //Prueba añadir producto y pago
    await driver.findElement(By.linkText("All Flowers")).click();
    await driver.get("http://localhost:8000/allflowers");

    // Selecciona el tercer producto (índice 2) y agrega 1 a la cantidad
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

    // Espera a que la URL contenga "/basket" después de agregar el producto al carrito
    await driver.wait(until.urlContains("/basket"), 5000);

    // Llenar la información de envío
    await driver.findElement(By.id("houseFlatNumber")).sendKeys("123");
    await driver.findElement(By.id("addressLine1")).sendKeys("London Street");
    await driver.findElement(By.id("addressLine2")).sendKeys("albion Road");
    await driver.findElement(By.id("postcode")).sendKeys("SE45 9TF");

    // Llenar el campo de mensaje de la tarjeta si es necesario
    await driver
      .findElement(By.id("cardMessage"))
      .sendKeys("Happy Mother's Day");

    // Hacer clic en el botón "Pay with Card" para proceder al pago
    await driver.findElement(By.css(".stripe-button-el")).click();

    // Prueba de comentarios de usuarios
    await driver.findElement(By.linkText("Add Comments")).click();
    await driver.wait(until.urlIs("http://localhost:8000/add_comments"), 5000);
    await driver
      .findElement(By.id("comment_text"))
      .sendKeys("This is a Selenium test comment");

    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlIs("http://localhost:8000/comments"), 5000);

    console.log("All tests passed successfully!");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await driver.quit();
  }
}

runTests();
