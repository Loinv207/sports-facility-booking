package com.sportsfacilitybooking.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter  jwtAuthFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(
        JwtAuthenticationFilter  jwtAuthFilter,
        JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
        CustomAccessDeniedHandler accessDeniedHandler) {

            this.jwtAuthFilter = jwtAuthFilter;
            this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
            this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
        .cors(cors -> {})
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/public/**").permitAll()
            .requestMatchers("/h2-console/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/swagger-ui.html").permitAll()
            .requestMatchers("/v3/api-docs/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/fields", "/api/fields/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/fields/*/reviews").hasAnyRole("USER")
            .requestMatchers(HttpMethod.POST, "/api/fields").hasAnyRole("OWNER", "ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/fields/*").hasAnyRole("OWNER", "ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/fields/*").hasAnyRole("OWNER", "ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
            .requestMatchers("/api/categories/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/bookings").hasAnyRole("USER")
            .requestMatchers(HttpMethod.GET, "/api/bookings/user").hasAnyRole("USER")
            .requestMatchers(HttpMethod.PUT, "/api/bookings/user/*/cancel").hasAnyRole("USER")
            .requestMatchers(HttpMethod.POST, "/api/bookings/user/*/confirm-payment").hasAnyRole("USER")
            .requestMatchers("/api/owner/**").hasRole("OWNER")
            .requestMatchers("/api/notifications/broadcast").hasRole("ADMIN")
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
            .anyRequest().authenticated()
        )
        .exceptionHandling(ex -> ex
            .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            .accessDeniedHandler(accessDeniedHandler)
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.headers(headers -> headers.frameOptions(f -> f.sameOrigin()));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
