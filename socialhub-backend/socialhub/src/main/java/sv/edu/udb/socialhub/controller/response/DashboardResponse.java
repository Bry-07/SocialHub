package sv.edu.udb.socialhub.controller.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalPosts;
    private long totalComments;
    private List<PostSummaryResponse> latestPosts;
    private PostSummaryResponse mostCommentedPost;
}