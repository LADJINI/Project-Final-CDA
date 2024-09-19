package fr.doranco.rest.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import fr.doranco.rest.entities.User;
import fr.doranco.rest.services.UserService;

/**
 * Service pour charger les détails de l'utilisateur pour l'authentification JWT.
 */
@Service
public class JwtUserDetailsService implements UserDetailsService {
    private final UserService userService;

    /**
     * Constructeur pour l'injection de dépendances.
     * Utilisation de @Lazy pour casser la dépendance circulaire.
     * @param userService Le service utilisateur pour récupérer les informations de l'utilisateur.
     */
    @Autowired
    public JwtUserDetailsService(@Lazy UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findUserByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return UserDetailsImpl.build(user);
    }
}
