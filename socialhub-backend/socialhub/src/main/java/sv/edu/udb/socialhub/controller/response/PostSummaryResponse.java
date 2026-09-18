package sv.edu.udb.socialhub.controller.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostSummaryResponse {

    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private long commentsCount;
}