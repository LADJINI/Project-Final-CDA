package fr.doranco.rest;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import io.github.bonigarcia.wdm.WebDriverManager;

import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedCondition;

import java.time.Duration;

public class BookControllerSeleniumTest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    public void setUp() {
        // Configuration du WebDriver avec Chrome
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); // Lancer le navigateur en mode sans tête pour les tests automatisés
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // Attente explicite
    }

    @Test
      public void testAddBook() {
        // Naviguer vers la page d'ajout de livre
        driver.get("http://localhost:5173/ajouter-livre-vente"); // Remplacez l'URL par celle qui mène à la page de formulaire d'ajout de livre

        // Attendre que les champs du formulaire soient visibles
        WebElement titleField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("title")));
        WebElement authorField = driver.findElement(By.id("author"));
        WebElement isbnField = driver.findElement(By.id("isbn"));
        WebElement publisherField = driver.findElement(By.id("publisher"));
        WebElement publicationDateField = driver.findElement(By.id("publicationDate"));
        WebElement numberOfPagesField = driver.findElement(By.id("numberOfPages"));
        WebElement bookConditionField = driver.findElement(By.id("bookCondition"));
        WebElement availabilityField = driver.findElement(By.id("availability"));
        WebElement descriptionField = driver.findElement(By.id("description"));
        WebElement quantityAvailableField = driver.findElement(By.id("quantityAvailable"));
        WebElement priceField = driver.findElement(By.id("price"));
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

        // Remplir le formulaire avec des données de test
        titleField.sendKeys("Test Book");
        authorField.sendKeys("Test Author");
        isbnField.sendKeys("111222333");
        publisherField.sendKeys("Test Publisher");
        publicationDateField.sendKeys("2024-01-01"); // Format de date
        numberOfPagesField.sendKeys("350");
        bookConditionField.sendKeys("New");
        availabilityField.sendKeys("true");
        descriptionField.sendKeys("A comprehensive book about testing.");
        quantityAvailableField.sendKeys("20");
        priceField.sendKeys("29.99");

        // Soumettre le formulaire
        submitButton.click();

        
    }

    @Test
    public void testDeleteBook() {
        // Naviguer vers la page contenant les livres
        driver.get("http://localhost:5173/books"); // Remplacez par l'URL qui liste les livres

        // Trouver et cliquer sur le bouton de suppression du livre (par exemple, basé sur le titre ou un autre critère)
        WebElement deleteButton = driver.findElement(By.xpath("//button[contains(text(),'Delete')]"));
        deleteButton.click();

        // Attendre que l'alerte de confirmation apparaisse
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        alert.accept();  // Accepter l'alerte de confirmation

        // Vérifier si le livre a été supprimé (par exemple, vérifier qu'il n'est plus dans la liste)
        boolean isBookDeleted = driver.findElements(By.xpath("//div[contains(text(),'Test Book')]")).isEmpty();
        assertTrue(isBookDeleted, "Le livre n'a pas été supprimé correctement.");
    }

    @Test
    public void testUpdateBook() {
        // Naviguer vers la page de modification du livre
        driver.get("http://localhost:5173/edit-book/1"); // Remplacez par l'URL qui mène à l'édition d'un livre avec un ID valide

        // Remplir les champs du formulaire pour modifier les informations du livre
        WebElement titleField = driver.findElement(By.id("title"));
        WebElement authorField = driver.findElement(By.id("author"));
        WebElement isbnField = driver.findElement(By.id("isbn"));
        WebElement publisherField = driver.findElement(By.id("publisher"));
        WebElement publicationDateField = driver.findElement(By.id("publicationDate"));
        WebElement numberOfPagesField = driver.findElement(By.id("numberOfPages"));
        WebElement bookConditionField = driver.findElement(By.id("bookCondition"));
        WebElement availabilityField = driver.findElement(By.id("availability"));
        WebElement descriptionField = driver.findElement(By.id("description"));
        WebElement quantityAvailableField = driver.findElement(By.id("quantityAvailable"));
        WebElement priceField = driver.findElement(By.id("price"));
        WebElement updateButton = driver.findElement(By.cssSelector("button[type='submit']"));

        // Modifier les informations
        titleField.clear();
        titleField.sendKeys("Updated Book Title");
        authorField.clear();
        authorField.sendKeys("Updated Author");
        isbnField.clear();
        isbnField.sendKeys("444555666");
        publisherField.clear();
        publisherField.sendKeys("Updated Publisher");
        publicationDateField.clear();
        publicationDateField.sendKeys("2025-12-31");
        numberOfPagesField.clear();
        numberOfPagesField.sendKeys("400");
        bookConditionField.clear();
        bookConditionField.sendKeys("Used");
        availabilityField.clear();
        availabilityField.sendKeys("false");
        descriptionField.clear();
        descriptionField.sendKeys("An updated version of the book.");
        quantityAvailableField.clear();
        quantityAvailableField.sendKeys("15");
        priceField.clear();
        priceField.sendKeys("39.99");

        // Soumettre le formulaire de mise à jour
        updateButton.click();

        // Vérifier que la mise à jour a bien été effectuée (exemple avec la vérification d'un titre modifié)
        WebElement updatedTitle = driver.findElement(By.xpath("//div[contains(text(),'Updated Book Title')]"));
        assertTrue(updatedTitle.isDisplayed(), "Le livre n'a pas été mis à jour correctement.");
    }

    @Test
    public void testGetBookById() {
        // Naviguer vers la page du livre avec un ID spécifique
        driver.get("http://localhost:5173/don-livre"); // Remplacez avec un ID valide de livre

        // Attendre que le titre et d'autres informations du livre soient visibles
        WebElement bookTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("bookTitle")));
        WebElement bookAuthor = driver.findElement(By.id("bookAuthor"));

        // Vérifier que les informations du livre sont correctes
        assertTrue(bookTitle.isDisplayed(), "Le titre du livre n'est pas affiché.");
        assertTrue(bookAuthor.isDisplayed(), "L'auteur du livre n'est pas affiché.");
    }

    @Test
    public void tearDown() {
        // Fermer le navigateur après chaque test
        if (driver != null) {
            driver.quit();
        }
    }
}
