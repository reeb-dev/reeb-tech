package com.arautos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ArautosApplication {
  public static void main(String[] args) {
    SpringApplication.run(ArautosApplication.class, args);
  }
}
