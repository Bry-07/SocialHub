package sv.edu.udb.socialhub.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.edu.udb.socialhub.controller.response.DashboardResponse;
import sv.edu.udb.socialhub.controller.response.PostSummaryResponse;
import sv.edu.udb.socialhub.repository.PostCommentRepository;
import sv.edu.udb.socialhub.repository.PostRepository;
import sv.edu.udb.socialhub.repository.domain.Post;
import sv.edu.udb.socialhub.service.DashboardService;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        long totalPosts = postRepository.count();
        long totalComments = postCommentRepository.count();

        List<PostSummaryResponse> latestPosts = postRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toSummary)
                .toList();

        PostSummaryResponse mostCommented = postCommentRepository
                .findMostCommentedPosts(PageRequest.of(0, 1))
                .stream()
                .findFirst()
                .map(this::toSummary)
                .orElse(null);

        return DashboardResponse.builder()
                .totalPosts(totalPosts)
                .totalComments(totalComments)
                .latestPosts(latestPosts)
                .mostCommentedPost(mostCommented)
                .build();
    }

    private PostSummaryResponse toSummary(Post post) {
        long commentsCount = postCommentRepository.countByPostId(post.getId());
        return PostSummaryResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .commentsCount(commentsCount)
                .build();
    }
}