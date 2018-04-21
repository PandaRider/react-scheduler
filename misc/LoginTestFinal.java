import org.openqa.selenium.WebDriver;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

import org.junit.Assert;

public class LoginTestFinal  {
  public static void main(String[] args) {

//	System.setProperty("webdriver.chrome.driver", "C:\\Users\\usr\\Downloads\\geckodriver-v0.19.1-win64\\chromedriver.exe");
//	System.setProperty("webdriver.ie.driver", "C:\\Users\\User\\Downloads\\geckodriver-v0.19.1-win64\\IEDriverServer.exe");
    System.setProperty("webdriver.gecko.driver","C:\\Users\\User\\Downloads\\geckodriver.exe");


//     Create an instance of the driver
//    WebDriver driver = new ChromeDriver();
//    WebDriver driver = new InternetExplorerDriver();
    WebDriver driver = new FirefoxDriver();

    // Navigate to a web page
//    driver.navigate().to("google.com");
    driver.get("http://react-scheduler-2018.azurewebsites.net/");

    WebElement clickbluetext = driver.findElement(By.id("loginLink"));
    clickbluetext.click();

    try {
      WebDriverWait wait = new WebDriverWait(driver, 5);
      wait.until(ExpectedConditions.elementToBeClickable(By.name("email")));
    } catch (Exception NoSuchElementException){
      System.out.println("lag");
    }

    // Perform actions on HTML elements, entering text and submitting the form
    WebElement usernameElement     = driver.findElement(By.name("email"));
    WebElement passwordElement     = driver.findElement(By.name("password"));
//    WebElement formElement        = driver.findElement(By.id("loginForm"));

    usernameElement.sendKeys("admin@test.com");
    passwordElement.sendKeys("password");

    passwordElement.submit(); // submit by text input element
//    formElement.submit();        // submit by form element


    // Anticipate web browser response, with an explicit wait
//    WebDriverWait wait = new WebDriverWait(driver, 10);
//    WebElement messageElement = wait.until(
//           ExpectedConditions.presenceOfElementLocated(By.id("loginResponse"))
//            );

//    // Run a test
//    String message                 = messageElement.getText();
//    String successMsg             = "Welcome to foo. You logged in successfully.";
//    Assert.assertEquals (message, successMsg);

    // Conclude a test
    WebDriverWait wait = new WebDriverWait(driver, 10);
    WebElement calElement = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.className("rbc-time-view"))
    );

    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }


//    driver.get("http://react-scheduler-2018.azurewebsites.net/login"); //crashes the webdriver

    try {
      wait = new WebDriverWait(driver, 5);
      wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[@aria-haspopup=\"true\"]")));
    } catch (Exception NoSuchElementException){
    }

    WebElement logout = driver.findElement(By.xpath("//button[@aria-haspopup=\"true\"]"));
    logout.click();

    try {
      wait = new WebDriverWait(driver, 5);
//      wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//li[@role=\"menuitem\" and @tabindex=\"0\"]")));
      wait.until(ExpectedConditions.elementToBeClickable(By.xpath("/html/body/div[2]/div[2]/ul/li[2]")));
    } catch (Exception NoSuchElementException){
      System.out.println("here");
    }

    WebElement logout2 = driver.findElement(By.xpath("/html/body/div[2]/div[2]/ul/li[2]"));
    logout2.click();

    try {
      wait = new WebDriverWait(driver, 5);
      wait.until(ExpectedConditions.elementToBeClickable(By.name("email")));
    } catch (Exception NoSuchElementException){
      System.out.println("here2");
    }

    usernameElement     = driver.findElement(By.name("email"));
    passwordElement     = driver.findElement(By.name("password"));

    usernameElement.sendKeys("admin@test.com");
    passwordElement.sendKeys("pass1234");

    passwordElement.submit();

    for (int i=0;i<5;i++) {

	    try {
	      Thread.sleep(5000);
	    } catch (InterruptedException e) {
	      e.printStackTrace();
	    }

	    usernameElement.clear();
	    passwordElement.clear();
	    usernameElement.sendKeys("someone@google.com");
	    passwordElement.sendKeys("pass1234");
	    passwordElement.submit();
    }


    try {
      Thread.sleep(5000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

    driver.quit();

  }
}
