package homeSchool.com.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class FindResponseDTO {

    private boolean success;

    private String message;

    private String data;
}
