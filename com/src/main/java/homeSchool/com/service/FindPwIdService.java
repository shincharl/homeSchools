package homeSchool.com.service;

import homeSchool.com.entity.Member;
import homeSchool.com.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FindPwIdService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailSender mailSender;

    // 이메일로 아이디 조회
    public String findUsernameByEmail(String email){
        return memberRepository.findByEmail(email)
                .map(Member::getUserId)
                .orElse(null);
    }

    // username과 이메일로 조회 후 이메일 발송
    public boolean sendPasswordResetEmail(String username, String email){
        Optional<Member> memberOpt = memberRepository.findByUserIdAndEmail(username, email);

        if (memberOpt.isEmpty()) return false;

        Member member = memberOpt.get();

        // 임시 비밀번호 생성(8자리)
        String tempPassword = generateTempPassword(8);

        // 임시 비밀번호 암호화 후 저장
        String encodePassword = passwordEncoder.encode(tempPassword);
        member.setPassword(encodePassword);
        member.setTempPassword(true);
        memberRepository.save(member);

        // 이메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(member.getEmail()); // 받는 사람 이메일
        message.setSubject("[홈스쿨] 임시 비밀번호 안내 "); // 제목
        message.setText(
                "안녕하세요 " + member.getNickName() + "님,\n\n" +
                        "요청하신 임시 비밀번호를 안내드립니다.\n" +
                        "임시 비밀번호: " + tempPassword + "\n\n" +
                        "로그인 후 반드시 비밀번호를 변경해주세요."
        );

        // 메일 발송
        mailSender.send(message);

        return true;
    }

    private String generateTempPassword(int length){
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int idx = (int)(Math.random() * chars.length());
            sb.append(chars.charAt(idx));
        }

        return  sb.toString();
    }


}
