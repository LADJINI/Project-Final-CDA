package fr.doranco.rest.controllers;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import fr.doranco.rest.dto.JwtResponse;
import fr.doranco.rest.dto.LoginRequest;
import fr.doranco.rest.security.JwtUtils;
import fr.doranco.rest.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getUsername() == null || loginRequest.getUsername().isEmpty()) {
            logger.error("Tentative de connexion avec un nom d'utilisateur null ou vide");
            return ResponseEntity.badRequest().body("Le nom d'utilisateur ne peut pas être vide");
        }
        
        logger.info("Tentative de connexion pour l'utilisateur : {}", loginRequest.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(userDetails);
            
            List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

            logger.info("Connexion réussie pour l'utilisateur : {}", loginRequest.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt, 
                                     userDetails.getId(), 
                                     userDetails.getUsername(), 
                                     userDetails.getEmail(), 
                                     roles));
        } catch (AuthenticationException e) {
            logger.error("Échec de l'authentification pour l'utilisateur : {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentification échouée : " + e.getMessage());
        }
    }
}