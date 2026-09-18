package sv.edu.udb.socialhub.service;

import sv.edu.udb.socialhub.controller.request.PostCommentRequest;
import sv.edu.udb.socialhub.controller.response.PostCommentResponse;

import java.util.List;

public interface PostCommentService {

    PostCommentResponse create(Long postId, PostCommentRequest request);

    List<PostCommentResponse> findByPostId(Long postId);

    PostCommentResponse update(Long commentId, PostCommentRequest request);

    void delete(Long commentId);
}