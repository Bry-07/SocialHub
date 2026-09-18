package sv.edu.udb.socialhub.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.edu.udb.socialhub.controller.request.PostCommentRequest;
import sv.edu.udb.socialhub.controller.response.PostCommentResponse;
import sv.edu.udb.socialhub.mapper.PostCommentMapper;
import sv.edu.udb.socialhub.repository.PostCommentRepository;
import sv.edu.udb.socialhub.repository.PostRepository;
import sv.edu.udb.socialhub.repository.domain.Post;
import sv.edu.udb.socialhub.repository.domain.PostComment;
import sv.edu.udb.socialhub.service.PostCommentService;
import sv.edu.udb.socialhub.service.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostCommentServiceImpl implements PostCommentService {

    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final PostCommentMapper postCommentMapper;

    @Override
    @Transactional
    public PostCommentResponse create(Long postId, PostCommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el post con id " + postId));

        PostComment comment = postCommentMapper.toEntity(request);
        comment.setPost(post);

        PostComment saved = postCommentRepository.save(comment);
        return postCommentMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostCommentResponse> findByPostId(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("No se encontró el post con id " + postId);
        }
        return postCommentRepository.findByPostId(postId)
                .stream()
                .map(postCommentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public PostCommentResponse update(Long commentId, PostCommentRequest request) {
        PostComment comment = findCommentOrThrow(commentId);
        postCommentMapper.updateEntityFromRequest(request, comment);
        return postCommentMapper.toResponse(comment);
    }

    @Override
    @Transactional
    public void delete(Long commentId) {
        PostComment comment = findCommentOrThrow(commentId);
        postCommentRepository.delete(comment);
    }

    private PostComment findCommentOrThrow(Long commentId) {
        return postCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el comentario con id " + commentId));
    }
}