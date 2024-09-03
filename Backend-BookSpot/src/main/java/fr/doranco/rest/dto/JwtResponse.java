package fr.doranco.rest.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username; // Changé de 'nom' à 'username' pour correspondre au constructeur
    private String email;
    private List<String> roles; // Changé de 'role' à 'roles' pour plus de clarté

    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username; // Corrigé : utilisez 'username' au lieu de 'nom'
        this.email = email;
        this.roles = roles; // Changé de 'role' à 'roles'
    }

    // Les getters et setters sont générés par Lombok
}