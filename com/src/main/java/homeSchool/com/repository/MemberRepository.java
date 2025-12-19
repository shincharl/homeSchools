package homeSchool.com.repository;

import homeSchool.com.entity.Member;
import homeSchool.com.enums.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    /* 일반 로그인 */
    // userId로 회원 존재 여부 확인
    boolean existsByUserId(String userId);

    // userId로 회원 조회
    Optional<Member> findByUserId(String userId);

    /* 회원정보 있는지 확인 */
    Optional<Member> findByProviderAndProviderId(Provider provider, long providerId);

    /* 이메일로 회원 조회 */
    Optional<Member> findByEmail(String email);

    Optional<Member> findByUserIdAndEmail(String userId, String email);
}
