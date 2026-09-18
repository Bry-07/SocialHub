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

@Schema(description = "Datos para crear o actualizar una publicación")
public class PostRequest {

    @Schema(description = "Título de la publicación", example = "Mi primer post")
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150)
    private String title;

    @Schema(description = "Contenido de la publicación", example = "Este es el contenido...")
    @NotBlank(message = "El contenido es obligatorio")
    private String content;
    // getters/setters/builder igual que antes
}