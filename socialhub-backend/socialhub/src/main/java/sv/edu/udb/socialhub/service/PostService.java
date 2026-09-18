package sv.edu.udb.socialhub.service;

import sv.edu.udb.socialhub.controller.request.PostRequest;
import sv.edu.udb.socialhub.controller.response.PostResponse;

import java.util.List;

public interface PostService {

    PostResponse create(PostRequest request);

    PostResponse findById(Long id);

    List<PostResponse> findAll();

    PostResponse update(Long id, PostRequest request);

    void delete(Long id);
}