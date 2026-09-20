# SocialHub

Aplicación full-stack de publicaciones y comentarios desarrollada como proyecto académico para la materia **Desarrollo de Aplicaciones con Web Frameworks**.

SocialHub está compuesta por un backend en **Spring Boot** que expone una API REST, y un frontend en **React + Vite** que la consume. El backend administra la persistencia y las reglas de negocio; el frontend se encarga exclusivamente de la interfaz y la interacción del usuario.

```
SocialHub/
├── capturas/
├── docs/
│       SocialHub_Explicada.docx
│       SocialHub_Frontend_Explicada.docx
│       SocialHub_Guia_Explicada.docx
│
├── socialhub-backend/
│   └── socialhub/          → proyecto Maven (Spring Boot)
│
└── socialhub-frontend/
    └── socialhub/          → proyecto Vite (React)
```

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelo de dominio](#modelo-de-dominio)
- [Endpoints de la API](#endpoints-de-la-api)
- [Manejo de errores](#manejo-de-errores)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Documentación de la API (Swagger)](#documentación-de-la-api-swagger)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Autor](#autor)

---

## Descripción general

SocialHub permite gestionar publicaciones (**posts**) y sus comentarios (**post comments**) mediante operaciones CRUD completas (Create, Read, Update, Delete), además de un dashboard con estadísticas generales.

- **Backend**: API REST que expone los datos en formato JSON, sin interfaz gráfica propia.
- **Frontend**: SPA (Single Page Application) que consume la API y renderiza la interfaz en el navegador, sin lógica de negocio propia.

---

## Arquitectura

### Backend — arquitectura en capas

| Capa | Responsabilidad |
| --- | --- |
| **Controller** | Recibe la petición HTTP, valida los datos de entrada (`@Valid`) y delega en el Service. |
| **Service** | Contiene las reglas de negocio y coordina al Repository y al Mapper. |
| **Repository** | Ejecuta las operaciones de acceso a datos contra la base de datos (JpaRepository). |
| **Entity (dominio)** | Representa el dato tal como se guarda en la base de datos. |
| **DTO (Request/Response)** | Representa el dato tal como se expone al cliente de la API. |

### Frontend — arquitectura por carpetas

| Carpeta | Contenido |
| --- | --- |
| `api/` | Funciones que se comunican con el backend usando Axios (`postService`, `commentService`, `dashboardService`) y configuración base (`axiosConfig.js`). |
| `components/` | Piezas de interfaz reutilizables sin lógica de datos: `Navbar`, `PostCard`, `CommentCard`, `SearchBar`, `Loading`, `ErrorMessage`. |
| `pages/` | Vistas completas asociadas a una ruta: `Dashboard`, `Posts`, `CreatePost`, `EditPost`, `PostDetail`. |
| `routes/` | Define qué page corresponde a cada URL (`AppRoutes.jsx`). |
| `utils/` | Funciones auxiliares: `constants.js`, `alerts.js` (SweetAlert2), `errorHandler.js`. |

El flujo de una petición siempre sigue el mismo patrón: **page → api/ (Axios) → backend → JSON → useState → components/**.

---

## Tecnologías

### Backend

- Java 17
- Spring Boot
- Spring Data JPA / Hibernate
- H2 Database (en memoria)
- Lombok
- MapStruct
- Jakarta Validation
- springdoc-openapi (Swagger UI)
- Maven

### Frontend

- React
- Vite
- Bootstrap 5
- Axios
- React Router DOM
- SweetAlert2

---

## Estructura del proyecto

### Backend — `socialhub-backend/socialhub/src/main/java/sv/edu/udb/socialhub`

```
socialhub/
│   SocialhubApplication.java
│
├── configuration/
│   │   CorsConfig.java
│   │   GlobalExceptionHandler.java
│   │   OpenApiConfig.java
│   │
│   └── web/
│           ApiError.java
│           ApiErrorWrapper.java
│
├── controller/
│   │   DashboardController.java
│   │   PostCommentController.java
│   │   PostController.java
│   │
│   ├── request/
│   │       PostCommentRequest.java
│   │       PostRequest.java
│   │
│   └── response/
│           DashboardResponse.java
│           PostCommentResponse.java
│           PostResponse.java
│           PostSummaryResponse.java
│
├── mapper/
│       PostCommentMapper.java
│       PostMapper.java
│
├── repository/
│   │   PostCommentRepository.java
│   │   PostRepository.java
│   │
│   └── domain/
│           Post.java
│           PostComment.java
│
└── service/
    │   DashboardService.java
    │   PostCommentService.java
    │   PostService.java
    │   ResourceNotFoundException.java
    │
    └── implementation/
            DashboardServiceImpl.java
            PostCommentServiceImpl.java
            PostServiceImpl.java
```

Recursos: `src/main/resources/application.properties`. Pruebas: `src/test/java/.../socialhub/SocialhubApplicationTests.java`.

### Frontend — `socialhub-frontend/socialhub/src`

```
src/
│   App.css
│   App.jsx
│   index.css
│   main.jsx
│
├── api/
│       axiosConfig.js
│       commentService.js
│       dashboardService.js
│       postService.js
│
├── assets/
│       hero.png
│       react.svg
│       vite.svg
│
├── components/
│       CommentCard.jsx
│       ErrorMessage.jsx
│       Loading.jsx
│       Navbar.jsx
│       PostCard.jsx
│       SearchBar.jsx
│
├── pages/
│       CreatePost.jsx
│       Dashboard.jsx
│       EditPost.jsx
│       PostDetail.jsx
│       Posts.jsx
│
├── routes/
│       AppRoutes.jsx
│
└── utils/
        alerts.js
        constants.js
        errorHandler.js
```

---

## Modelo de dominio

**Post** (1) → (N) **PostComment**

- `Post`: `id`, `title`, `content`, `createdAt`, lista de comentarios asociados.
- `PostComment`: `id`, `comment`, `author`, `createdAt`, referencia al `Post` al que pertenece (lado dueño de la relación).

La relación se configura con `cascade = ALL`, `orphanRemoval = true` y `fetch = LAZY` en el lado `@OneToMany` de `Post`.

---

## Endpoints de la API

| Ruta | Método | Descripción | Consumido por (frontend) |
| --- | --- | --- | --- |
| `/posts` | POST | Crea una publicación. Responde 201. | `createPost` — `CreatePost.jsx` |
| `/posts/{id}` | GET | Obtiene una publicación con sus comentarios. Responde 200. | `getPostById` — `PostDetail.jsx`, `EditPost.jsx` |
| `/posts` | GET | Lista todas las publicaciones. Responde 200. | `getAllPosts` — `Posts.jsx` |
| `/posts/{id}` | PUT | Actualiza una publicación. Responde 200. | `updatePost` — `EditPost.jsx` |
| `/posts/{id}` | DELETE | Elimina una publicación y sus comentarios. Responde 204. | `deletePost` — `Posts.jsx` |
| `/posts/{postId}/comments` | POST | Crea un comentario en una publicación. Responde 201. | `createComment` — `PostDetail.jsx` |
| `/posts/{postId}/comments` | GET | Lista los comentarios de una publicación. Responde 200. | `getCommentsByPost` — `PostDetail.jsx` |
| `/comments/{id}` | PUT | Actualiza un comentario. Responde 200. | `updateComment` — `PostDetail.jsx` |
| `/comments/{id}` | DELETE | Elimina un comentario. Responde 204. | `deleteComment` — `PostDetail.jsx` |
| `/dashboard` | GET | Estadísticas generales (total de posts, comentarios, últimas publicaciones, post con más comentarios). Responde 200. | `getDashboardData` — `Dashboard.jsx` |

---

## Manejo de errores

El backend centraliza el manejo de errores en un `@RestControllerAdvice` (`GlobalExceptionHandler`), que responde siempre con el mismo formato (`ApiError` / `ApiErrorWrapper`, con un campo `message`).

| Código | Cuándo ocurre |
| --- | --- |
| 400 | Los datos enviados no cumplen las validaciones del DTO. |
| 404 | El recurso solicitado (post o comentario) no existe. |
| 409 | La operación viola una restricción de integridad de la base de datos. |
| 500 | Error no anticipado; el cliente recibe un mensaje genérico. |

El frontend centraliza la lectura de ese error en `getErrorMessage(error)` (`utils/errorHandler.js`), usada en todos los bloques `.catch()`, y muestra el resultado con **SweetAlert2**.

---

## Instalación y ejecución

### Requisitos previos

- Java 17+
- Maven 3.8+
- Node.js 18+ y npm

### Backend

```bash
cd socialhub-backend/socialhub
./mvnw spring-boot:run
```

El backend levanta en `http://localhost:8080`. La base de datos H2 se crea en memoria en cada arranque (`ddl-auto=create-drop`), no requiere configuración adicional.

### Frontend

```bash
cd socialhub-frontend/socialhub
npm install
npm run dev
```

El frontend levanta en `http://localhost:5173` mediante Vite.

> **Nota (CORS):** el backend debe tener habilitado `localhost:5173` como origen permitido para que el frontend pueda consumir la API desde el navegador.

---

## Documentación de la API (Swagger)

Con el backend en ejecución:

- Especificación OpenAPI (JSON): `http://localhost:8080/api-docs`
- Interfaz interactiva (Swagger UI): `http://localhost:8080/swagger-ui.html`

---

## Documentación adicional

La carpeta [`docs/`](./docs) contiene guías explicativas del proyecto pensadas para la defensa:

- `SocialHub_Explicada.docx` — backend (arquitectura, capas, endpoints, preguntas típicas).
- `SocialHub_Frontend_Explicada.docx` — frontend (arquitectura, componentes, routing, preguntas típicas).
- `SocialHub_Guia_Explicada.docx` — guía general del proyecto.

---

## Autor

**Bry** — Proyecto individual (backend) y desarrollo de frontend, materia Desarrollo de Aplicaciones con Web Frameworks.
