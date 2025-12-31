package homeSchool.com.security;

import homeSchool.com.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final CustomUserDetailsService userDetailsService;

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();

    return "OPTIONS".equalsIgnoreCase(request.getMethod())
      || path.equals("/api/login")
      || path.equals("/api/register")
      || path.startsWith("/api/address")
      || path.startsWith("/api/contacts")
      || path.equals("/api/id/find")
      || path.equals("/api/password/find")
      || path.startsWith("/api/oauth2/authorize");
  }

      @Override
      protected void doFilterInternal(HttpServletRequest request,
                                      HttpServletResponse response,
                                      FilterChain filterChain)
        throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 🔒 토큰 없으면 그냥 통과 (permitAll / 비로그인 요청)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
          filterChain.doFilter(request, response);
          return;
        }

        String token = authHeader.substring(7);

        if (jwtProvider.validateToken(token)) {
          Long memberId = jwtProvider.getMemberId(token);

          UserDetails userDetails =
            userDetailsService.loadUserById(memberId);

          UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
              userDetails,
              null,
              userDetails.getAuthorities()
            );

          SecurityContextHolder.getContext()
            .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
      }
    }
