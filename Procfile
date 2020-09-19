web: java $JAVA_OPTS -Xmx256m -jar target/*.jar --spring.profiles.active=prod,heroku,no-liquibase --server.port=$PORT 
release: echo "Dossier:" && ls -a && echo "Main:" && ls src/main && echo "Ressources:" && ls src/main/ressources && echo "Arbre:" && tree && cp -R src/main/resources/config config && ./mvnw -ntp liquibase:update -Pprod,heroku
