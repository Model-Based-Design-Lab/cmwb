FROM ubuntu:24.04

WORKDIR /usr
ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get -y install default-jdk dos2unix nodejs npm unzip curl

# Install Maven 3.9.9
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz -o /tmp/apache-maven-3.9.9-bin.tar.gz \
    && tar -xzf /tmp/apache-maven-3.9.9-bin.tar.gz -C /opt \
    && ln -s /opt/apache-maven-3.9.9 /opt/maven \
    && ln -s /opt/maven/bin/mvn /usr/bin/mvn

# Create directory
WORKDIR /usr/wslsp

# compile xtext stuff
COPY ./cmlang/src ./cmlang
WORKDIR /usr/wslsp/cmlang/info.computationalmodeling.lang.parent
RUN  mvn install
RUN mkdir /usr/wslsp/lsp
RUN cp -r ./info.computationalmodeling.lang.lsp/target/cm-lsp-1.0.0-SNAPSHOT-unix.zip /usr/wslsp/lsp/
RUN unzip /usr/wslsp/lsp/cm-lsp-1.0.0-SNAPSHOT-unix.zip -d /usr/wslsp/lsp/
RUN mv /usr/wslsp/lsp/cm-lsp-1.0.0-SNAPSHOT/* /usr/wslsp/lsp/
RUN dos2unix /usr/wslsp/lsp/bin/cm-language-server-stdio
RUN chmod a+x /usr/wslsp/lsp/bin/cm-language-server-stdio



# install app
WORKDIR /usr/wslsp/wsapp
COPY ./webapplication/wslsp/*.json ./
COPY ./webapplication/wslsp/*.js ./
RUN npm install

# bundle the source
COPY ./webapplication/wslsp/src ./src

RUN npm run build

RUN npm install nodemon -g --save

EXPOSE 7999
CMD npm run server
