package homeSchool.com.config;

import homeSchool.com.security.JwtAuthenticationFilter;
import homeSchool.com.security.JwtProvider;
import homeSchool.com.service.CustomUserDetails;
import homeSchool.com.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.filter.ForwardedHeaderFilter;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;

    @Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService userDetailsService){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // 구현한 UserDetailService 연결
        authProvider.setPasswordEncoder(passwordEncoder()); // BCryptPasswordEncoder
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider authProvider, JwtAuthenticationFilter jwtFilter) throws Exception {
        http
          .authenticationProvider(authProvider) // 여기에 provider 등록
          .csrf(csrf -> csrf.disable())
          .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
          .cors(cors -> cors.configurationSource(corsConfigurationSource()))
          .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/api/oauth2/authorize/kakao/**").permitAll()
            .requestMatchers("/api/oauth2/authorize/naver/**").permitAll()
            .requestMatchers("/h2-console/**").permitAll() // H2 콘솔 허용
            .requestMatchers("/login").permitAll()
            .requestMatchers("/api/login").permitAll()
            .requestMatchers("/api/register").permitAll()
            .requestMatchers("/api/address/**").permitAll()
            .requestMatchers("/api/contacts/**").permitAll() // 누구나 접근 가능
            .requestMatchers("/api/id/find").permitAll()
            .requestMatchers("/api/password/find").permitAll()
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll()
          )
          .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form
                        .loginProcessingUrl("/api/login") // POST 요청 처리
                        .successHandler((req, res, auth) -> {
                          ;
                            Object principal = auth.getPrincipal();
                            String nickname = "";
                            Long memberId = null;
                            boolean tempPassword = true;

                            if(principal instanceof CustomUserDetails customUser){
                                nickname = customUser.getNickname();
                                memberId = customUser.getMemberId();
                                tempPassword = customUser.isTempPassword();
                            }

                            // JWT 생성
                            String token = jwtProvider.createToken(memberId, "LOCAL", nickname);

                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write(
                                    "{"
                                            + "\"message\":\"success\","
                                            + "\"nickname\":\"" + nickname + "\","
                                            + "\"token\":\"" + token + "\","
                                            + "\"tempPassword\":" + tempPassword
                                            + "}"
                            );
                        })
                        .failureHandler((req, res, ex) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"fail\"}");
                        })
                        .permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> {
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"error\":\"unauthorized\", \"redirect\":\"/login\"}");
                        })
                );


        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

      config.setAllowedOrigins(Arrays.asList(
            //"http://localhost:5173",
            //"https://gwi-homeschool.herokuapp.com",
            //"https://gwi-homeschool-8c27de57ef07.herokuapp.com",
            "https://home-schools-front-cfvk.vercel.app",
            "https://home-schools-front-cfvk-git-main-gwi-labs-projects.vercel.app",
            "https://home-schools-front-cfvk-4jw7e2u9n-gwi-labs-projects.vercel.app"
        ));


        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true); // 쿠키/토큰 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
      return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public ForwardedHeaderFilter forwardedHeaderFilter() {
      return new ForwardedHeaderFilter();
    }
}
