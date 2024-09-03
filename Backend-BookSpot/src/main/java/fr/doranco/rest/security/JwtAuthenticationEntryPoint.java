package fr.doranco.rest.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        
        // Envoyer un code d'erreur 401 Unauthorized lorsque l'utilisateur n'est pas authentifié
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Authentication token was either missing or invalid.");
    }
}
