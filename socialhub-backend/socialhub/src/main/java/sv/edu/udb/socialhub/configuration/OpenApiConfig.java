package sv.edu.udb.socialhub.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI socialHubOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("SocialHub API")
                        .description("API REST para administrar publicaciones y comentarios — Desafío Práctico 02 DWF")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Bry")
                                .email("bry@udb.edu.sv")));
    }
}