package homeSchool.com.controller;

import homeSchool.com.dto.ChangePasswordRequest;
import homeSchool.com.entity.Member;
import homeSchool.com.repository.MemberRepository;
import homeSchool.com.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/password")
public class PasswordChangeController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/change")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication){

        // 현재 로그인한 사용자
        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

       Long memberId = user.getMemberId();

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 비밀번호 암호화 후 변경
        member.setPassword(passwordEncoder.encode(request.getPassword()));

        // 임시 비밀번호 해제
        member.setTempPassword(false);

        memberRepository.save(member);


        return ResponseEntity.ok().build();
    }

}
