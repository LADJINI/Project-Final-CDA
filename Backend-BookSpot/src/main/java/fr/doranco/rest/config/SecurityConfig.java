package fr.doranco.rest.config;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import fr.doranco.rest.security.JwtAccessDeniedHandler;
import fr.doranco.rest.security.JwtAuthenticationEntryPoint;
import fr.doranco.rest.security.JwtRequestFilter;
import fr.doranco.rest.security.JwtService;

import java.util.Arrays;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration de sécurité pour l'application.
 * Définit la sécurité HTTP, le CORS, les filtres JWT, et l'encodage des mots de passe avec BCrypt.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig   {

    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    
    /**
     * Constructeur avec injection des dépendances.
     * Utilise @Lazy pour éviter les problèmes de circularité des dépendances.
     */
    @Autowired
    public SecurityConfig(@Lazy UserDetailsService userDetailsService, JwtService jwtService, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    /**
     * Configure le CORS pour l'application, permettant les requêtes depuis des origines spécifiques.
     */
   
    
  
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));

        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    
    /**
     * Crée un bean GridFSBucket pour interagir avec MongoDB GridFS.
     * @param mongoDatabaseFactory Factory pour créer la base de données Mongo.
     * @return GridFSBucket pour stocker et récupérer des fichiers.
     */
    @Bean
    public GridFSBucket getGridFSBucket(MongoDatabaseFactory mongoDatabaseFactory) {
        return GridFSBuckets.create(mongoDatabaseFactory.getMongoDatabase());
    }
  

    /**
     * Configuration principale de la sécurité HTTP.
     * Désactive CSRF, gère les autorisations d'accès aux différentes routes,
     * et intègre le filtre JWT pour la gestion des tokens.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Désactive CSRF car on utilise des tokens JWT
             .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Restreint les routes admin aux utilisateurs avec le rôle ADMIN
                .requestMatchers("/api/user/**").hasRole("USER")    // Restreint certaines routes aux utilisateurs avec le rôle USER
                .requestMatchers("/api/auth/**", "/api/auth/login", "/api/register").permitAll()  // Permet l'accès public aux routes d'authentification et d'enregistrement
                .requestMatchers("/api/users/**", "/api/addUser").permitAll()
                .requestMatchers("/api/books/**", "/api/books").permitAll()
                .requestMatchers("/api/roles/**").permitAll()
                .requestMatchers("/api/imageFile/**").permitAll()
                .requestMatchers("/api/transactions/**").permitAll()
               
                .requestMatchers("/api/transaction-types/**").permitAll()
                
                .anyRequest().authenticated()  // Toutes les autres routes nécessitent une authentification
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(new JwtAccessDeniedHandler())
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Les sessions sont désactivées, l'authentification est gérée via JWT
            )
            .addFilterBefore(jwtRequestFilter(), UsernamePasswordAuthenticationFilter.class)  // Ajoute le filtre JWT avant l'authentification standard
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));  // Configure le CORS

        return http.build();
    }

    /**
     * Bean pour le filtre JWT qui intercepte les requêtes et vérifie les tokens.
     */
    @Bean
    public JwtRequestFilter jwtRequestFilter() {
        return new JwtRequestFilter(userDetailsService, jwtService);
    }

    
    /**
     * Bean pour l'encodage des mots de passe utilisant BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean pour la gestion de l'authentification.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Fournisseur d'authentification qui utilise le service UserDetailsService et BCrypt pour valider les utilisateurs.
     */
    @Bean
   
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);  // Configure UserDetailsService pour charger les utilisateurs
        authProvider.setPasswordEncoder(passwordEncoder());  // Configure BCrypt pour l'encodage des mots de passe
        return authProvider;
    }
    
    // Ajout du bean MongoDatabase
    @Bean
    public MongoDatabase mongoDatabase(MongoDatabaseFactory mongoDatabaseFactory) {
        return mongoDatabaseFactory.getMongoDatabase();
    }
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}
