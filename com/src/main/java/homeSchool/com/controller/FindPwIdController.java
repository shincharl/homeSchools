package homeSchool.com.controller;

import homeSchool.com.dto.FindIdRequestDTO;
import homeSchool.com.dto.FindPwRequestDTO;
import homeSchool.com.dto.FindResponseDTO;
import homeSchool.com.service.FindPwIdService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FindPwIdController {

    private final FindPwIdService findPwIdService;

    // 아이디 찾기
    @PostMapping("id/find")
    public ResponseEntity<FindResponseDTO> findId(@RequestBody FindIdRequestDTO request){
        String username = findPwIdService.findUsernameByEmail(request.getEmail());
        if(username != null){
            return ResponseEntity.ok(new FindResponseDTO(true, "아이디 찾기 성공", username));
        } else {
            return ResponseEntity.status(404).body(new FindResponseDTO(false, "등록된 이메일이 없습니다.", null));
        }
    }
    
    // 비밀번호 찾기
    @PostMapping("/password/find")
    public ResponseEntity<FindResponseDTO> findPassword(@RequestBody FindPwRequestDTO request){
        boolean result = findPwIdService.sendPasswordResetEmail(request.getUsername(), request.getEmail());

        if(result){
            return ResponseEntity.ok(new FindResponseDTO(true, "임시 비밀번호를 이메일로 발송했습니다.", null));
        } else {
            return ResponseEntity.status(404)
                    .body(new FindResponseDTO(false, "아이디 또는 이메일이 일치하지 않습니다.", null));
        }
    }
}
