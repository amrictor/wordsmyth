@ECHO OFF
REM maven itself uses a batch file so each mvn must be preceded by "call"
REM the -f flag specifies where the pom.xml is found for the project

call mvn package -f server\demo\pom.xml
java -jar target\server-1.0-SNAPSHOT.jar