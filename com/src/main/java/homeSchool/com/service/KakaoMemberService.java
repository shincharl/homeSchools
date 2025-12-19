package homeSchool.com.service;

import homeSchool.com.dto.KakaoUserDTO;
import homeSchool.com.entity.Member;
import homeSchool.com.enums.Provider;
import homeSchool.com.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KakaoMemberService {

    private final MemberRepository memberRepository;

    public Member getKakaoUserIfExists(KakaoUserDTO kakaoUser){

        return memberRepository
                .findByProviderAndProviderId(
                        Provider.KAKAO,
                        kakaoUser.getKakaoId()
                )
                .orElse(null);
    }

    public Member getOrCreateKakaoMember(KakaoUserDTO kakaoUser){

        return memberRepository.findByProviderAndProviderId(Provider.KAKAO, kakaoUser.getKakaoId())
                .orElseGet(() -> {
                   Member member = Member.builder()
                           .providerId(kakaoUser.getKakaoId())
                           .nickName(kakaoUser.getNickname())
                           .email(kakaoUser.getEmail())
                           .provider(Provider.KAKAO)
                           .build();

                   return memberRepository.save(member);
                });
    }
}
