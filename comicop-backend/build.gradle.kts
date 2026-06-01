plugins {
	java
	id("org.springframework.boot") version "3.4.4"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		// Dùng Java 21 LTS
		languageVersion = JavaLanguageVersion.of(21)
	}
}

// Lombok cần config này để tự sinh @Getter @Setter @Builder
configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	// Spring Web — tạo REST API (@RestController, @GetMapping...)
	implementation("org.springframework.boot:spring-boot-starter-web")

	// Spring Data JPA — kết nối DB, không cần viết SQL thủ công
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	// HTMX tích hợp Thymeleaf — cập nhật partial HTML không reload trang
	implementation("io.github.wimdeblauwe:htmx-spring-boot:4.0.1")

	// Thymeleaf — server-side HTML template (cart.html, login.html...)
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")

	// Lombok — tự sinh getter/setter/builder, giảm boilerplate code
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// Test
	testImplementation("org.springframework.boot:spring-boot-starter-test")

	// DevTools — auto-restart khi sửa code, tăng tốc dev
	"developmentOnly"("org.springframework.boot:spring-boot-devtools")

	// PostgreSQL driver — kết nối Java với PostgreSQL
	runtimeOnly("org.postgresql:postgresql")

	// Test runner
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	// java-dotenv — đọc file .env trong Java
	implementation("io.github.cdimascio:java-dotenv:5.2.2")

	// Jackson — tự chuyển Java Object <-> JSON khi gọi/trả API
	implementation("com.fasterxml.jackson.core:jackson-databind:2.19.0")

	// Spring Security — bảo vệ API endpoint
	implementation("org.springframework.boot:spring-boot-starter-security")

	// JWT — tạo và xác thực token đăng nhập
	implementation("io.jsonwebtoken:jjwt-api:0.12.3")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.3")

	// BCrypt — mã hoá password (có sẵn trong Spring Security, không cần thêm)
}

tasks.withType<Test> {
	useJUnitPlatform()
}