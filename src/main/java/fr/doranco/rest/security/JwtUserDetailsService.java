package fr.doranco.rest.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import fr.doranco.rest.repository.IUserRepository;

import java.util.Collections;
@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private IUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        fr.doranco.rest.entities.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Unknown user: " + email));

        String roleName = user.getRole().getName().name();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(roleName);

        // Retourner une instance de UserDetailsImpl avec le constructeur approprié
        return new UserDetailsImpl(
                user.getId(), // Assurez-vous d'inclure l'ID dans le constructeur
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }
}
