FROM ubuntu:20.04

WORKDIR /usr
ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get -y install default-jdk dos2unix nodejs npm

# Create directory
WORKDIR /usr/wslsp

# compile xtext stuff
COPY ./cmlang/src ./cmlang
WORKDIR /usr/wslsp/cmlang/info.computationalmodeling.lang.parent
RUN dos2unix ./gradlew
RUN  ./gradlew installdist
RUN mkdir /usr/wslsp/lsp
RUN cp -r ./info.computationalmodeling.lang.ide/build/install/info.computationalmodeling.lang.ide/* /usr/wslsp/lsp/

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
