package fr.doranco.rest;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import org.testng.Assert;

public class UserControllerSeleniumTest {
    private WebDriver driver;

    @BeforeAll
    public static void setup() {
        WebDriverManager.chromedriver().setup();
    }

    @BeforeEach
    public void init() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
    }

    @Test
    public void testLogin() {
        driver.get("http://localhost:5173"); // Charge la page d'accueil

        // Attendre et cliquer sur le bouton "Identifiez-vous"
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        WebElement authButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[span[text()='Identifiez-vous']]")));
        authButton.click(); // Cliquer sur le bouton pour ouvrir la modal

        // Attendre que la modal devienne visible
        WebElement authModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".fixed.inset-0")));  // Cible la modal avec les classes fixed et inset-0

        // Vérifier que la modal est bien affichée
        Assert.assertTrue(authModal.isDisplayed(), "La modal d'authentification n'est pas visible");

        // Remplir les champs de connexion (email et mot de passe)
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("email")));
        WebElement passwordField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("password")));

        // Envoyer les données de connexion
        emailField.sendKeys("jean.dupont@example.com");
        passwordField.sendKeys("MotDePasse123");

        // Cliquer sur le bouton de soumission (connexion)
        WebElement submitButton = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[type='submit']")));
        submitButton.click();

        // Attendre la redirection vers la page du tableau de bord (par exemple)
        WebElement dashboard = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("dashboard")));
        Assert.assertTrue(dashboard.isDisplayed(), "L'utilisateur n'a pas été redirigé vers le tableau de bord après la connexion.");
    }

    @Test
    public void testRegister() {
        driver.get("http://localhost:5173");

        // Ouvrir la modal d'inscription
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement authModal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".fixed.inset-0"))); // Modal d'authentification
        Assert.assertTrue(authModal.isDisplayed());

        // Cliquer pour passer à l'inscription
        WebElement switchToRegister = driver.findElement(By.cssSelector("button.text-blue-600"));
        switchToRegister.click();

        // Remplir le formulaire d'inscription
        WebElement nomField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("nom")));
        WebElement prenomField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("prenom")));
        WebElement emailField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("email")));
        WebElement passwordField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("password")));
        WebElement confirmPasswordField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("confirmPassword")));
        WebElement sexeField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("sexe")));
        WebElement dateNaissanceField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("dateNaissance")));
        WebElement telephoneField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("telephone")));
        WebElement adresseField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.name("adresse")));

        nomField.sendKeys("Dupont");
        prenomField.sendKeys("Jean");
        emailField.sendKeys("jean.dupont@example.com");
        passwordField.sendKeys("MotDePasse123");
        confirmPasswordField.sendKeys("MotDePasse123");
        sexeField.sendKeys("homme"); // Peut être un select ou un radio button
        dateNaissanceField.sendKeys("1990-01-01");
        telephoneField.sendKeys("0612345678");
        adresseField.sendKeys("12 rue de Paris, 75001 Paris");

        // Soumettre le formulaire d'inscription
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();

        // Vérifier que l'utilisateur a bien été inscrit avec succès
        WebElement successMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("successMessage")));
        Assert.assertTrue(successMessage.isDisplayed());
        Assert.assertEquals(successMessage.getText(), "Inscription réussie ! Vous pouvez maintenant vous connecter.");
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
