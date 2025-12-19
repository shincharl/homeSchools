package homeSchool.com.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class KakaoUserDTO {

    private Long kakaoId;
    private String email;
    private String nickname;
}
