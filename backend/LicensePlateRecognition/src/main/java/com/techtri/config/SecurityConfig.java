package com.techtri.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.techtri.config.filter.JWTAuthenticationFilter;
import com.techtri.config.filter.JWTAuthorizationFilter;
import com.techtri.persistence.MemberRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	private AuthenticationConfiguration authenticationConfiguration;

	@Autowired
	private MemberRepository memberRepository;
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	SecurityFilterChain fiterChain(HttpSecurity http) throws Exception {

		http.authorizeHttpRequests(auth -> auth
//				.requestMatchers(new AntPathRequestMatcher("/api/private/**")).authenticated()
				.anyRequest().permitAll());

		http.csrf(csrf -> csrf.disable());
		http.cors(cors -> cors.configurationSource(corsFilter()));
		http.formLogin(frmLogin -> frmLogin.disable());
		http.httpBasic(basic -> basic.disable());
		http.sessionManagement(ssmn -> ssmn.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		http.addFilter(new JWTAuthenticationFilter(authenticationConfiguration.getAuthenticationManager()));
		http.addFilterBefore(new JWTAuthorizationFilter(memberRepository), AuthorizationFilter.class);

		return http.build();
	}

	private CorsConfigurationSource corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
//		config.addAllowedOrigin("http://localhost:3000"); // 교차를 허용할 Origin

		config.addAllowedOriginPattern("*");
		config.addAllowedMethod("*"); 
		config.addAllowedHeader("*"); 
		config.setAllowCredentials(true); 
		config.addExposedHeader(HttpHeaders.AUTHORIZATION);
		
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
