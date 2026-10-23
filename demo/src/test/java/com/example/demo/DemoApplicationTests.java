package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// Perfil h2: las pruebas no necesitan un PostgreSQL corriendo.
@SpringBootTest
@ActiveProfiles("h2")
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

}
