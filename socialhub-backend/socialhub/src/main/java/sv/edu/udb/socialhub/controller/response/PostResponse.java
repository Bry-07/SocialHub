package sv.edu.udb.socialhub.controller.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Estructura de respuesta que representa una publicación completa")
public class PostResponse {

    @Schema(description = "Identificador único del post generado por la base de datos", example = "1")
    private Long id;

    @Schema(description = "Título de la publicación", example = "Mi primer post")
    private String title;

    @Schema(description = "Contenido completo de la publicación", example = "Este es el contenido...")
    private String content;

    @Schema(description = "Fecha y hora exacta en la que se creó la publicación", example = "2026-09-17T22:40:00")
    private LocalDateTime createdAt;

    @Schema(description = "Lista de comentarios asociados a esta publicación")
    private List<PostCommentResponse> comments;
}