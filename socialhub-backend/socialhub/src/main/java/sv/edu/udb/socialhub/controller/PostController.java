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
import sv.edu.udb.socialhub.controller.request.PostRequest;
import sv.edu.udb.socialhub.controller.response.PostResponse;
import sv.edu.udb.socialhub.service.PostService;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "Posts", description = "Operaciones sobre publicaciones")
public class PostController {

    private final PostService postService;

    @Operation(summary = "Crear una publicación")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Publicación creada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<PostResponse> save(@Valid @RequestBody PostRequest request) {
        PostResponse response = postService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Obtener una publicación por id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Publicación encontrada"),
            @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }

    @Operation(summary = "Listar todas las publicaciones")
    @GetMapping
    public ResponseEntity<List<PostResponse>> findAll() {
        return ResponseEntity.ok(postService.findAll());
    }

    @Operation(summary = "Actualizar una publicación existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Publicación actualizada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.update(id, request));
    }

    @Operation(summary = "Eliminar una publicación")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Publicación eliminada"),
            @ApiResponse(responseCode = "404", description = "Publicación no encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}