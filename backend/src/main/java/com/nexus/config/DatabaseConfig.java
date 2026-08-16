package com.nexus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.boot.jdbc.DataSourceBuilder;
import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        // Check System properties first (set by DotenvConfig), then environment variables
        String databaseUrl = System.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            databaseUrl = System.getenv("DATABASE_URL");
        }

        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            // Fallback to default autowired / properties database setup (useful for local dev)
            return DataSourceBuilder.create().build();
        }

        try {
            // Standardise the protocol if it is postgres:// or postgresql://
            String cleanUrl = databaseUrl;
            if (cleanUrl.startsWith("postgres://")) {
                cleanUrl = cleanUrl.replace("postgres://", "postgresql://");
            }

            URI uri = new URI(cleanUrl);
            String username = "";
            String password = "";

            if (uri.getUserInfo() != null) {
                String[] userInfo = uri.getUserInfo().split(":", 2);
                username = URLDecoder.decode(userInfo[0], StandardCharsets.UTF_8);
                if (userInfo.length > 1) {
                    password = URLDecoder.decode(userInfo[1], StandardCharsets.UTF_8);
                }
            }

            // Construct the JDBC URL format: jdbc:postgresql://host:port/database
            String host = uri.getHost();
            int port = uri.getPort();
            if (port == -1) {
                port = 5432; // Default postgres port
            }
            String path = uri.getPath();

            // Build JDBC URL
            String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;

            // Ensure sslmode=require is appended for secure cloud environments (e.g. Render)
            // Skip for localhost/local development
            boolean isLocalhost = "localhost".equals(host) || "127.0.0.1".equals(host) || "0.0.0.0".equals(host);
            if (!isLocalhost && !jdbcUrl.contains("sslmode=")) {
                if (jdbcUrl.contains("?")) {
                    jdbcUrl += "&sslmode=require";
                } else {
                    jdbcUrl += "?sslmode=require";
                }
            }

            return DataSourceBuilder.create()
                    .url(jdbcUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();

        } catch (URISyntaxException | IllegalArgumentException e) {
            // Fallback to properties if parsing fails
            return DataSourceBuilder.create().build();
        }
    }
}