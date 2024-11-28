package fr.doranco.rest;

import org.junit.jupiter.api.Test;

import io.github.bonigarcia.wdm.WebDriverManager;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;

import io.github.bonigarcia.wdm.WebDriverManager;

public class simpleTest {
	@Test
	public void simpleTest() {
	    WebDriverManager.chromedriver().setup();
	    WebDriver driver = new ChromeDriver();
	    driver.get("http://www.google.com");
	    Assert.assertEquals(driver.getTitle(), "Google");
	    driver.quit();
	}

}
