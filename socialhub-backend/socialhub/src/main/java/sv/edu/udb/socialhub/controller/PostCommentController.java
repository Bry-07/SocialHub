package sv.edu.udb.socialhub.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.edu.udb.socialhub.controller.request.PostCommentRequest;
import sv.edu.udb.socialhub.controller.response.PostCommentResponse;
import sv.edu.udb.socialhub.service.PostCommentService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Operaciones sobre comentarios") // AGREGADO: Categoría visual en Swagger
public class PostCommentController {

    private final PostCommentService postCommentService;

    @Operation(summary = "Crear un comentario dentro de un post") // AGREGADO: Qué hace el método
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Comentario creado con éxito"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "404", description = "El post asociado no existe")
    })
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<PostCommentResponse> save(@PathVariable Long postId,
                                                    @Valid @RequestBody PostCommentRequest request) {
        PostCommentResponse response = postCommentService.create(postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Listar los comentarios de un post específico") // AGREGADO
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de comentarios obtenida"),
            @ApiResponse(responseCode = "404", description = "El post asociado no existe")
    })
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<PostCommentResponse>> findByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(postCommentService.findByPostId(postId));
    }

    @Operation(summary = "Actualizar un comentario puntual por su id") // AGREGADO
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comentario actualizado con éxito"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "404", description = "El comentario no existe")
    })
    @PutMapping("/comments/{id}")
    public ResponseEntity<PostCommentResponse> update(@PathVariable Long id,
                                                      @Valid @RequestBody PostCommentRequest request) {
        return ResponseEntity.ok(postCommentService.update(id, request));
    }

    @Operation(summary = "Eliminar un comentario puntual por su id") // AGREGADO
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Comentario eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "El comentario no existe")
    })
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postCommentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}