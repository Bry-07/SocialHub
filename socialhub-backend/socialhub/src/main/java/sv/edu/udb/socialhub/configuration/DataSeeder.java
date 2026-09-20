package sv.edu.udb.socialhub.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import sv.edu.udb.socialhub.repository.PostCommentRepository;
import sv.edu.udb.socialhub.repository.PostRepository;
import sv.edu.udb.socialhub.repository.domain.Post;
import sv.edu.udb.socialhub.repository.domain.PostComment;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (postRepository.count() > 0) {
            return;
        }

        seedPost(
                "Backend con ExpressJS",
                "Construye APIs REST profesionales con ExpressJS, aplicando middlewares, rutas, controladores y una estructura modular. El curso incluye validacion de entradas, manejo centralizado de errores y buenas practicas para preparar servicios listos para produccion.",
                List.of()
        );
        seedPost(
                "Fundamentos de Node.js",
                "Comprende el entorno de ejecucion de Node.js desde sus fundamentos: event loop, modulos, npm, operaciones asincronas y acceso a archivos. Aprenderas a organizar proyectos mantenibles y a crear servicios eficientes sin perder claridad en el codigo.",
                List.of(
                        new CommentData("Mariana Lopez", "La explicacion del event loop me ayudo a entender mejor el comportamiento asincrono de Node.js.")
                )
        );
        seedPost(
                "TypeScript: Tipos Avanzados y Funciones",
                "Profundiza en TypeScript con genericos, tipos condicionales, utility types, overloads y funciones tipadas. Las practicas estan orientadas a diseñar contratos robustos que reduzcan errores y mejoren la experiencia de desarrollo en equipos.",
                List.of(
                        new CommentData("Carlos Mejia", "Los ejemplos de genericos muestran muy bien como reutilizar tipos sin perder seguridad."),
                        new CommentData("Sofia Hernandez", "Me gusto que el contenido conecte los utility types con casos reales de aplicaciones web.")
                )
        );
        seedPost(
                "TypeScript",
                "Da tus primeros pasos con TypeScript y transforma proyectos JavaScript en codigo mas seguro y facil de mantener. El recorrido cubre configuracion, inferencia, interfaces, clases, union types y la integracion gradual en aplicaciones existentes.",
                List.of(
                        new CommentData("Diego Ramirez", "El modulo de interfaces aclara una duda que tenia desde hace varias semanas."),
                        new CommentData("Valeria Cruz", "La progresion de los ejercicios hace que el aprendizaje sea muy natural."),
                        new CommentData("Andres Flores", "Buen punto de partida para migrar un proyecto pequeno sin hacerlo de una sola vez.")
                )
        );
        seedPost(
                "Fundamentos de JavaScript",
                "Domina las bases que necesitas para trabajar en el ecosistema web: variables, funciones, objetos, arreglos, scope, closures y manipulacion del DOM. Cada tema se acompaña con ejercicios practicos para consolidar el razonamiento con JavaScript.",
                List.of(
                        new CommentData("Gabriela Torres", "Los ejercicios de closures fueron desafiantes, pero muy utiles para afianzar el concepto."),
                        new CommentData("Luis Martinez", "La seccion de objetos y arreglos esta explicada de forma clara y ordenada."),
                        new CommentData("Natalia Perez", "Ahora entiendo mejor la diferencia entre scope global y scope local."),
                        new CommentData("Fernando Castillo", "Es un curso excelente para construir una base antes de pasar a React.")
                )
        );
        seedPost(
                "Git y GitHub",
                "Aprende a trabajar con control de versiones de forma profesional usando Git y GitHub. Practicaras ramas, commits claros, pull requests, resolucion de conflictos y flujos de colaboracion que pueden aplicarse desde el primer proyecto en equipo.",
                List.of(
                        new CommentData("Camila Rivas", "La practica de pull requests refleja muy bien el flujo que usamos en el trabajo."),
                        new CommentData("Jose Aguilar", "La explicacion para resolver conflictos me ahorro mucho tiempo en mi siguiente proyecto."),
                        new CommentData("Paula Molina", "Muy buenos consejos para escribir mensajes de commit mas utiles."),
                        new CommentData("Ricardo Vega", "La diferencia entre merge y rebase quedo mucho mas clara con el ejercicio."),
                        new CommentData("Elena Sanchez", "Este contenido deberia ser obligatorio antes de comenzar un proyecto colaborativo.")
                )
        );
    }

    private void seedPost(String title, String content, List<CommentData> comments) {
        Post post = postRepository.save(Post.builder()
                .title(title)
                .content(content)
                .build());

        comments.stream()
                .map(comment -> PostComment.builder()
                        .author(comment.author())
                        .comment(comment.comment())
                        .post(post)
                        .build())
                .forEach(postCommentRepository::save);
    }

    private record CommentData(String author, String comment) {
    }
}
