# =========================
# BUILD STAGE
# =========================
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven project files
COPY demo/pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY demo/src ./src

# Build Spring Boot application
RUN mvn clean package -DskipTests


# =========================
# RUN STAGE
# =========================
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy generated JAR
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]