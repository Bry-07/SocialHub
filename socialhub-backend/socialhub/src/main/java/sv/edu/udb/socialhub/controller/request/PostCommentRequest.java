package sv.edu.udb.socialhub.controller.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Datos necesarios para crear o actualizar un comentario")
public class PostCommentRequest {

    @Schema(description = "Contenido del comentario", example = "¡Excelente artículo, me sirvió mucho!")
    @NotBlank(message = "El comentario no puede estar vacío")
    private String comment;

    @Schema(description = "Nombre o nickname del autor del comentario", example = "JuanPerez99")
    @NotBlank(message = "El autor es obligatorio")
    @Size(max = 100, message = "El nombre del autor no puede superar los 100 caracteres")
    private String author;
}