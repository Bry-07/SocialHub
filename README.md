# SocialHub

Aplicación full-stack de publicaciones y comentarios desarrollada como proyecto académico para la materia **Desarrollo de Aplicaciones con Web Frameworks**.

SocialHub está compuesta por un backend en **Spring Boot** que expone una API REST, y un frontend en **React + Vite** que la consume. El backend administra la persistencia, las reglas de negocio y los datos iniciales de demostración; el frontend se encarga de la interfaz y la interacción del usuario.

```
SocialHub/
├── capturas/
├── docs/
│       SocialHub-AB250136.docx
│       estructura-proyecto.txt
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
- [Datos de demostración](#datos-de-demostración)
- [Endpoints de la API](#endpoints-de-la-api)
- [Manejo de errores](#manejo-de-errores)
- [Funcionalidades del frontend](#funcionalidades-del-frontend)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Validación](#validación)
- [Documentación de la API (Swagger)](#documentación-de-la-api-swagger)
- [Documentación adicional](#documentación-adicional)
- [Autor](#autor)

---

## Descripción general

SocialHub permite gestionar publicaciones (**posts**) y sus comentarios (**post comments**) mediante operaciones CRUD completas (Create, Read, Update, Delete), además de un dashboard con estadísticas generales.

- **Backend**: API REST que expone los datos en formato JSON, sin interfaz gráfica propia.
- **Frontend**: SPA (Single Page Application) que consume la API y renderiza la interfaz en el navegador, sin lógica de negocio propia.
- **Persistencia local**: H2 en memoria, recreada en cada arranque mediante `ddl-auto=create-drop`.
- **Datos iniciales**: `DataSeeder` carga publicaciones y comentarios cuando `postRepository.count()` es igual a cero.

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
| `pages/` | Vistas completas asociadas a una ruta: `Dashboard`, `Posts`, `CreatePost`, `EditPost`, `PostDetail`. Incluyen layouts responsive y cancelación de formularios. |
| `routes/` | Define qué page corresponde a cada URL (`AppRoutes.jsx`). |
| `utils/` | Funciones auxiliares: `constants.js`, `alerts.js` (SweetAlert2), `errorHandler.js`. |

El flujo de una petición siempre sigue el mismo patrón: **page → api/ (Axios) → backend → JSON → useState → components/**.

---

## Tecnologías

### Backend

- Java 17
- Spring Boot 4.1.1
- Spring Data JPA / Hibernate
- H2 Database (en memoria)
- Lombok
- MapStruct
- Jakarta Validation
- springdoc-openapi (Swagger UI)
- Maven

### Frontend

- React 19.2.8
- Vite 8.3.0
- Bootstrap 5.3.8
- Axios 1.20.0
- React Router DOM 7.18.4
- SweetAlert2 11.26.25

---

## Estructura del proyecto

### Backend — `socialhub-backend/socialhub/src/main/java/sv/edu/udb/socialhub`

```
socialhub/
│   SocialhubApplication.java
│
├── configuration/
│   │   CorsConfig.java
│   │   DataSeeder.java
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

La relación se configura con `cascade = ALL` y `orphanRemoval = true` en el lado `@OneToMany` de `Post`, mientras que `PostComment.post` es el lado propietario mediante `@ManyToOne(fetch = LAZY)`.

---

## Datos de demostración

`configuration/DataSeeder.java` implementa `ApplicationRunner` y se ejecuta al iniciar Spring Boot.

- Si `postRepository.count()` es mayor que cero, no inserta registros.
- Si la base está vacía, crea seis publicaciones y sus comentarios.
- Los comentarios se guardan asociados a su publicación mediante `PostComment.post`.
- Los registros pueden editarse y eliminarse desde la aplicación.
- H2 se recrea en cada arranque porque `spring.jpa.hibernate.ddl-auto=create-drop`; por eso los datos de demostración vuelven a aparecer después de reiniciar.

| Publicación | Comentarios iniciales |
| --- | ---: |
| Backend con ExpressJS | 0 |
| Fundamentos de Node.js | 1 |
| TypeScript: Tipos Avanzados y Funciones | 2 |
| TypeScript | 3 |
| Fundamentos de JavaScript | 4 |
| Git y GitHub | 5 |

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

## Funcionalidades del frontend

### Dashboard

- Muestra el total de publicaciones y comentarios.
- Destaca la publicación más comentada con título, fecha y cantidad de comentarios.
- Presenta las publicaciones recientes como cards pequeñas.

### Publicaciones

- Busca por título o contenido.
- Filtra por publicaciones con comentarios, sin comentarios, recientes y más comentadas.
- Presenta las publicaciones como cards verticales responsive.
- Cada card muestra título, fecha, cantidad de comentarios, resumen y acciones.

### Detalle y comentarios

- Muestra la publicación seleccionada y su contenido.
- Presenta cada comentario como una card con autor, fecha, contenido y acciones.
- Permite crear, editar y eliminar comentarios.
- Los formularios de crear y editar incluyen un botón secundario `Cancelar` que redirige a `/posts`.

La grilla utiliza cuatro columnas en pantallas amplias, dos en tablet y una en mobile.

---

## Instalación y ejecución

### Requisitos previos

- Java 17+
- Node.js 18+ y npm

Maven no necesita estar instalado globalmente porque el backend incluye Maven Wrapper.

### Backend en Windows

```powershell
Set-Location "socialhub-backend\socialhub"
.\mvnw.cmd spring-boot:run
```

### Backend en Linux o macOS

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

## Validación

### Backend

```powershell
cd socialhub-backend\socialhub
.\mvnw.cmd test
```

### Frontend

```bash
cd socialhub-frontend/socialhub
npm run lint
npm run build
```

---

## Documentación de la API (Swagger)

Con el backend en ejecución:

- Especificación OpenAPI (JSON): `http://localhost:8080/api-docs`
- Interfaz interactiva (Swagger UI): `http://localhost:8080/swagger-ui.html`

---

## Documentación adicional

La carpeta [`docs/`](./docs) contiene la documentación disponible actualmente:

- [`estructura-proyecto.txt`](./docs/estructura-proyecto.txt): árbol del proyecto con las carpetas y archivos relevantes.
- `SocialHub-AB250136.docx`: documento académico del proyecto.

---

## Autor

**Bry** — Proyecto individual (backend) y desarrollo de frontend, materia Desarrollo de Aplicaciones con Web Frameworks.
