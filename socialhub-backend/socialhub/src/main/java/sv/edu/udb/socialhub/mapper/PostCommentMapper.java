package sv.edu.udb.socialhub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import sv.edu.udb.socialhub.controller.request.PostCommentRequest;
import sv.edu.udb.socialhub.controller.response.PostCommentResponse;
import sv.edu.udb.socialhub.repository.domain.PostComment;

@Mapper(componentModel = "spring")
public interface PostCommentMapper {

    PostComment toEntity(PostCommentRequest request);

    PostCommentResponse toResponse(PostComment comment);

    void updateEntityFromRequest(PostCommentRequest request, @MappingTarget PostComment comment);
}