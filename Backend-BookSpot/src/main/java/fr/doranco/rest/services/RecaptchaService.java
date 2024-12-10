package fr.doranco.rest.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {

    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean validateToken(String recaptchaToken) {
        RestTemplate restTemplate = new RestTemplate();

        // URL pour valider le token reCAPTCHA avec le secret
        String url = RECAPTCHA_VERIFY_URL + "?secret=" + recaptchaSecret + "&response=" + recaptchaToken;

        try {
            // Faire une requête POST à l'API reCAPTCHA
            RecaptchaResponse response = restTemplate.postForObject(url, null, RecaptchaResponse.class);
            return response != null && response.isSuccess();
        } catch (Exception e) {
            // En cas d'échec de la validation
            e.printStackTrace();
            return false;
        }
    }

    // Classe interne pour analyser la réponse de Google reCAPTCHA
    static class RecaptchaResponse {
        private boolean success;

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }
    }
}
