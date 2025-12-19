package homeSchool.com.entity;

import homeSchool.com.enums.Provider;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEMBER_ID")
    private Long id;

    @Column
    private String name;

    @Column
    private String nickName;

    @Column
    private String userId;

    @Column
    private String password;

    @Column
    private String address;

    @Column
    private String email;

    @Builder.Default
    @Column(nullable = false)
    private boolean tempPassword = false;

    // 소셜 로그인 정보

    private Long providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider; // 로그인 확장을 위한 필드 ex) LOCAL, KAKAO, GIT, GOOGLE

    @Builder.Default
    @OneToMany(mappedBy = "member")
    private List<Contact> contacts = new ArrayList<>();

}
