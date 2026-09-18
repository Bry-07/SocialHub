package sv.edu.udb.socialhub.configuration.web;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorWrapper {

    private int status;
    private String error;
    private String path;
    private LocalDateTime timestamp;
    private List<String> messages;
}