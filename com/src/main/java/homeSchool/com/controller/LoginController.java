package homeSchool.com.controller;

import homeSchool.com.config.KakaoProperties;
import homeSchool.com.config.NaverProperties;
import homeSchool.com.dto.KakaoUserDTO;
import homeSchool.com.dto.NaverUserDTO;
import homeSchool.com.entity.Member;
import homeSchool.com.enums.Provider;
import homeSchool.com.repository.MemberRepository;
import homeSchool.com.security.JwtProvider;
import homeSchool.com.service.KaKaoService;
import homeSchool.com.service.KakaoMemberService;
import homeSchool.com.service.NaverMemberService;
import homeSchool.com.service.NaverService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class LoginController {

    // 카카오 로그인 설정
    private final KaKaoService kaKaoService;
    private final KakaoMemberService kakaoMemberService;
    private final KakaoProperties kakaoProperties;
    private final JwtProvider jwtProvider;

    // 네이버 로그인 설정
    private final NaverProperties naverProperties;
    private final NaverService naverService;
    private final NaverMemberService naverMemberService;

    // 로컬 로그인 설정
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/api/oauth2/authorize/kakao/start")
    public void redirectToKakaoAuth(HttpServletResponse response) throws IOException {
        String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize" +
                "?client_id=" + kakaoProperties.getClientId() +
                "&redirect_uri=" + kakaoProperties.getRedirectUri() +
                "&response_type=code";
        response.sendRedirect(kakaoAuthUrl);
    }

    @GetMapping("/api/oauth2/authorize/naver/start")
    public void redirectToNaverAuth(HttpServletResponse response) throws IOException {
        String state = UUID.randomUUID().toString();
        String naverAuthUrl = "https://nid.naver.com/oauth2.0/authorize" +
                "?response_type=code" +
                "&client_id=" + naverProperties.getClientId() +
                "&redirect_uri=" + URLEncoder.encode(naverProperties.getRedirectUri(), "UTF-8") +
                "&state=" + state;

        response.sendRedirect((naverAuthUrl));
    }

    @GetMapping("/api/oauth2/authorize/kakao")
    public void kakaoCallback(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) throws IOException {

        // 카카오 사용자 정보 가져오기
        KakaoUserDTO kakaoUser = kaKaoService.kakoLogin(code);

        if (kakaoUser == null) {
            response.sendRedirect("http://localhost:5178/login?error=kakao_login_failed");
            return;
        }

        Member member = kakaoMemberService.getOrCreateKakaoMember(kakaoUser);


        Member orCreateKakaoMember = kakaoMemberService.getOrCreateKakaoMember(kakaoUser);

        // JWT 생성
        String token = jwtProvider.createToken(
                member.getId(),
                member.getProvider().name(),
                member.getNickName()
        );

        // 로그인 성공, 프론트로 로그인한 사용자(카카오 프로필 닉네임)의 닉네임 들고 redirect
        response.sendRedirect(
                "http://localhost:5173/oauth/redirect" +
                        "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
                );
    }

    @GetMapping("/api/oauth2/authorize/naver")
    public void naverCallback(
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            HttpServletResponse response
    ) throws IOException {

        // 1. Access Token 요청
        String accessToken = naverService.getAccessToken(code, state);

        if(accessToken == null){
            response.sendRedirect("http://localhost:5173/login?error=naver_login_failed");
            return;
        }
        
        // 2. 사용자 정보 가져오기
        NaverUserDTO naverUser = naverService.getUserProfile(accessToken);

        if (naverUser == null) {
            response.sendRedirect("http://localhost:5173/login?error=naver_login_failed");
            return;
        }

        // 3. DB에서 회원 조회 또는 생성
        Member member = naverMemberService.getOrCreateNaverMember(naverUser);

        // 4. JWT 생성
        String token = jwtProvider.createToken(
                member.getId(),
                member.getProvider().name(),
                member.getNickName()
        );
        
        // 5. 로그인 성공, 프런트로 리다이렉트
        response.sendRedirect(
                "http://localhost:5173/oauth/redirect?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
        );

    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest){
        String userId = loginRequest.get("username");
        String password = loginRequest.get("password");

        Optional<Member> memberOpt = memberRepository.findByUserId(userId);

        if(memberOpt.isEmpty()){
            return ResponseEntity.status(401).body("회원이 존재하지 않습니다.");
        }

        Member member = memberOpt.get();

        // 비밀번호 검증
        if(!passwordEncoder.matches(password, member.getPassword())){
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 틀렸습니다.");
        }

        // JWT 생성
        String token = jwtProvider.createToken(
                member.getId(),
                member.getProvider().name(),
                member.getNickName()
        );
        
        // 로그인 성공
        Map<String, Object> response = new HashMap<>();
        response.put("nickname", member.getNickName());
        response.put("token", token);
        response.put("tempPassword", member.isTempPassword());

        return ResponseEntity.ok(response);

    }



}
