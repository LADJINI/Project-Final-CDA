package fr.doranco.rest.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) 
            throws IOException, ServletException {
        
        // Envoyer un code d'erreur 403 Forbidden lorsque l'accès est refusé
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: You don't have permission to access this resource.");
    }
}
