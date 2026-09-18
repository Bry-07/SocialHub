package sv.edu.udb.socialhub.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import sv.edu.udb.socialhub.controller.request.PostRequest;
import sv.edu.udb.socialhub.controller.response.PostResponse;
import sv.edu.udb.socialhub.repository.domain.Post;

@Mapper(componentModel = "spring", uses = PostCommentMapper.class)
public interface PostMapper {

    Post toEntity(PostRequest request);

    PostResponse toResponse(Post post);

    void updateEntityFromRequest(PostRequest request, @MappingTarget Post post);
}