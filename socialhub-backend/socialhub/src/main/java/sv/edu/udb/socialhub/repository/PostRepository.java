package sv.edu.udb.socialhub.repository;

import sv.edu.udb.socialhub.repository.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findTop5ByOrderByCreatedAtDesc();
 }