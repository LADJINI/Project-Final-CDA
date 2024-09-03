package fr.doranco.rest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import fr.doranco.rest.security.JwtAccessDeniedHandler;
import fr.doranco.rest.security.JwtAuthenticationEntryPoint;
import fr.doranco.rest.security.JwtRequestFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;

// a programmer plus tard ce 3 Configuration
//Configuration CORS pour permettre les requêtes cross-origin.
//Une politique de sécurité du contenu de base.
//Un exemple de logging pour les échecs d'authentification.

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Autowired
	private JwtRequestFilter jwtRequestFilter;

	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity; use cautiously
				.authorizeHttpRequests(authz -> authz
						.requestMatchers("/api/auth/**", "/api/register").permitAll()
						.requestMatchers("/api/users/**").permitAll()
						.requestMatchers("/api/addUser").permitAll()
						.requestMatchers("/api/books/**").permitAll()
						.requestMatchers("/api/books").permitAll()
						.requestMatchers("/api/roles/**").permitAll()
						.anyRequest().permitAll()
						
				)
				.exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(jwtAuthenticationEntryPoint)
						.accessDeniedHandler(new JwtAccessDeniedHandler()))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless
																												// session
																												// management
				);

		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());
		return authProvider;
	}
}