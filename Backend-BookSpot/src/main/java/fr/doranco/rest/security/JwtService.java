package fr.doranco.rest.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.token.validity}")
    private long tokenValidity;

    // Extraire le username du token JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extraire une information spécifique (claim) du token JWT
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Générer un token JWT pour un utilisateur
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }

    // Valider le token JWT
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Vérifier si le token est expiré
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extraire la date d'expiration du token JWT
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extraire toutes les informations (claims) du token JWT
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
        } catch (JwtException | IllegalArgumentException e) {
            // Log and handle the exception as needed
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    // Créer un token JWT avec les informations nécessaires
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + tokenValidity))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Récupérer la clé de signature utilisée pour signer le token JWT
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}
