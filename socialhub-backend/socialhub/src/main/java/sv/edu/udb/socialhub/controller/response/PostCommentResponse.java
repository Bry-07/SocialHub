package sv.edu.udb.socialhub.controller.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Estructura de respuesta que representa un comentario")
public class PostCommentResponse {

    @Schema(description = "Identificador único del comentario", example = "25")
    private Long id;

    @Schema(description = "Texto del comentario", example = "¡Excelente artículo, me sirvió mucho!")
    private String comment;

    @Schema(description = "Autor del comentario", example = "JuanPerez99")
    private String author;

    @Schema(description = "Fecha y hora exacta en la que se registró el comentario", example = "2026-09-17T23:15:00")
    private LocalDateTime createdAt;
}