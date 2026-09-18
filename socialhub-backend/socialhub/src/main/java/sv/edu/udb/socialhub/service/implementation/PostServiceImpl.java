package sv.edu.udb.socialhub.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.edu.udb.socialhub.controller.request.PostRequest;
import sv.edu.udb.socialhub.controller.response.PostResponse;
import sv.edu.udb.socialhub.mapper.PostMapper;
import sv.edu.udb.socialhub.repository.PostRepository;
import sv.edu.udb.socialhub.repository.domain.Post;
import sv.edu.udb.socialhub.service.PostService;
import sv.edu.udb.socialhub.service.ResourceNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;

    @Override
    @Transactional
    public PostResponse create(PostRequest request) {
        Post post = postMapper.toEntity(request);
        Post saved = postRepository.save(post);
        return postMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse findById(Long id) {
        Post post = findPostOrThrow(id);
        return postMapper.toResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> findAll() {
        return postRepository.findAll()
                .stream()
                .map(postMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public PostResponse update(Long id, PostRequest request) {
        Post post = findPostOrThrow(id);
        postMapper.updateEntityFromRequest(request, post);
        return postMapper.toResponse(post);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Post post = findPostOrThrow(id);
        postRepository.delete(post);
    }

    private Post findPostOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el post con id " + id));
    }
}