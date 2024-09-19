package fr.doranco.rest.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import java.util.stream.Collectors;

public class UserRoleAuthority {

    public static List<SimpleGrantedAuthority> getAuthorities(List<String> roles) {
        return roles.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
    }
}
