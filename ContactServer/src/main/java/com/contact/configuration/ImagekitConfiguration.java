package com.contact.configuration;

import io.github.cdimascio.dotenv.Dotenv;
import io.imagekit.sdk.ImageKit;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ImagekitConfiguration {
    private final String publicKey;
    private final  String privateKey;
    private final  String urlEndpoint;
    public ImagekitConfiguration() {
        Dotenv dotenv=Dotenv.load();
        publicKey= dotenv.get("PUBLIC_IMAGEKIT_KEY");
        privateKey= dotenv.get("PRIVATE_IMAGEKIT_KEY");
        urlEndpoint= dotenv.get("IMAGEKIT_URL_ENDPOINT");

    }
    @Bean
    public ImageKit imagekit(){
        io.imagekit.sdk.config.Configuration  config = new io.imagekit.sdk.config.Configuration(publicKey, privateKey, urlEndpoint);
        ImageKit imageKit = ImageKit.getInstance();
        imageKit.setConfig(config);
        return imageKit;
    }
}
