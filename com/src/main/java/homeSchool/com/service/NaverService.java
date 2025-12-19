package homeSchool.com.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import homeSchool.com.config.NaverProperties;
import homeSchool.com.dto.NaverUserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class NaverService {

    private final NaverProperties naverProperties;
    private final RestTemplate restTemplate = new RestTemplate();

    // Access Token 요청
    public String getAccessToken(String code, String state){
        String tokenUrl = "https://nid.naver.com/oauth2.0/token" +
                "?grant_type=authorization_code" +
                "&client_id=" + naverProperties.getClientId() +
                "&client_secret=" + naverProperties.getClientSecret() +
                "&code=" + code +
                "&state=" + state;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(tokenUrl, String.class);

            System.out.println("네이버 토큰 응답 원문: " + response.getBody());

            JsonNode json = new ObjectMapper().readTree(response.getBody());
            return json.get("access_token").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    // 사용자 프로필 조회
    public NaverUserDTO getUserProfile(String accessToken){
        String profileUrl = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response =
                    restTemplate.exchange(profileUrl, HttpMethod.GET, entity, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.getBody());

            JsonNode resp = root.get("response");
            if(resp == null || resp.isNull()) {
                throw new RuntimeException("네이버 response가 없음: " + response.getBody());
            }

            NaverUserDTO user = new NaverUserDTO();

            user.setId(resp.get("id").asText());

            if(resp.has("nickname") && !resp.get("nickname").isNull()) {
                user.setNickname(resp.get("nickname").asText());
            } else if (resp.has("name") && !resp.get("name").isNull()) {
                user.setNickname(resp.get("name").asText());
            } else {
                user.setNickname("네이버유저");
            }

            if(resp.has("email") && !resp.get("email").isNull()){
                user.setEmail(resp.get("email").asText());
            } else {
                user.setEmail(null);
            }

            return user;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}
