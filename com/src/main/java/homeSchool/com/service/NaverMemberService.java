package homeSchool.com.service;

import homeSchool.com.dto.NaverUserDTO;
import homeSchool.com.entity.Member;
import homeSchool.com.enums.Provider;
import homeSchool.com.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NaverMemberService {

    private final MemberRepository memberRepository;

//    // DB에 이미 있는 회원이면 반환
//    public Member getNaverUserIfExists(NaverUserDTO naverUser){
//        return memberRepository
//                .findByProviderAndProviderId(
//                        Provider.Naver,
//                        naverUser.getId()
//                )
//                .orElse(null);
//    }
    
    // 없으면 생성 후 반환
    public Member getOrCreateNaverMember(NaverUserDTO naverUser){

        Long providerId = normalizeProviderId(naverUser.getId());

        return memberRepository
                .findByProviderAndProviderId(Provider.Naver, providerId)
                .orElseGet(() -> {
                   Member member = Member.builder()
                           .providerId(providerId)
                           .nickName(naverUser.getNickname())
                           .email(naverUser.getEmail())
                           .provider(Provider.Naver)
                           .build();

                   return  memberRepository.save(member);
                });
    }
    // naver는 string 값으로 id가 전송된다. 해당 값을 숫자로 반환하는 메서드
    private Long normalizeProviderId(String providerId) {
        try {
            return Long.parseLong(providerId);
        } catch (NumberFormatException e) {
            // 숫자가 아니면 해시 기반 Long 생성
            return Math.abs((long)providerId.hashCode());
        }
    }

}
