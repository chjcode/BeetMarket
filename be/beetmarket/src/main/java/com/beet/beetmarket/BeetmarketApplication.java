package com.beet.beetmarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class BeetmarketApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeetmarketApplication.class, args);
	}

}
