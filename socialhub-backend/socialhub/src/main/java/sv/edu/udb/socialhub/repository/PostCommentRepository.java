package sv.edu.udb.socialhub.repository;

import org.springframework.data.jpa.repository.Query;
import sv.edu.udb.socialhub.repository.domain.Post;
import sv.edu.udb.socialhub.repository.domain.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {

    List<PostComment> findByPost(Post post);

    List<PostComment> findByPostId(Long postId);

    long countByPostId(Long postId);

    @Query("""
        SELECT pc.post FROM PostComment pc
        GROUP BY pc.post
        ORDER BY COUNT(pc) DESC
        """)
    List<Post> findMostCommentedPosts(Pageable pageable);
}