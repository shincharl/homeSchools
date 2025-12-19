package homeSchool.com.service;

import homeSchool.com.config.KakaoProperties;
import homeSchool.com.dto.KakaoUserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;


@Service
@RequiredArgsConstructor
public class KaKaoService {

    private final KakaoProperties kakaoProperties;

    private final RestTemplate restTemplate = new RestTemplate();

    /*
    * 카카오 로그인 전체 흐름
    * code -> access_token -> 사용자 정보
    */

    public KakaoUserDTO kakoLogin(String code) {

        // 1. 일단 카카오에서 인가 코드를 받아서 해당 1회용 코드를 인가토큰으로 교환한다.
        String accessToken = getAccessToken(code);
        
        // 2. 받은 인가 토큰으로 실제 사용할 사용자 정보로 바꾸기
        return getUserInfo(accessToken);
    }

    /*
    * code로 access_tocken 요청
    */
    private String getAccessToken(String code){

        HttpHeaders headers = new HttpHeaders();
        // 카카오 토큰 발급은 JSON 요청이 아니라 form 방식만 받는다.
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type","authorization_code");
        params.add("client_id", kakaoProperties.getClientId());
        System.out.println("client_id: " + kakaoProperties.getClientId());

        params.add("client_secret", kakaoProperties.getClientSecret());
        System.out.println("client_secret: " + kakaoProperties.getClientSecret());


        params.add("redirect_uri", kakaoProperties.getRedirectUri());
        System.out.println("redirect_uri" + kakaoProperties.getRedirectUri());

        params.add("code", code);
        System.out.println("code:" + code);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                kakaoProperties.getTokenUri(),
                request,
                Map.class
        );

        return (String) response.getBody().get("access_token");
    }

    /*
    * access_token으로 사용자 정보 조회
    */
    private KakaoUserDTO getUserInfo(String accessToken){

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                kakaoProperties.getUserInfoUri(),
                HttpMethod.GET,
                request,
                Map.class
        );

        Map<String, Object> body = response.getBody();

        // 카카오 아이디 가져오기

        long kakaoId = ((Number) body.get("id")).longValue();

        Map<String, Object> kakaoAccount =
                (Map<String, Object>) body.get("kakao_account");

        // 카카오 이메일 가져오기

        String email = kakaoAccount != null
                ? (String) kakaoAccount.get("email")
                : null;

        Map<String, Object> profile =
                kakaoAccount != null
                        ? (Map<String, Object>) kakaoAccount.get("profile")
                        :null;

        // 카카오
        
        String nickname = profile != null
                ? (String) profile.get("nickname")
                : "카카오유저";

        return new KakaoUserDTO(kakaoId, email, nickname);
    }


}
