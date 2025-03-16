# note tired to update to 24.04, but it seems that the gradle build is not working anymore, todo: fix
FROM ubuntu:20.04

WORKDIR /usr
ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get -y install default-jdk dos2unix graphviz python3-pip build-essential libssl-dev libffi-dev python3-dev python3-venv libcairo2-dev curl git

# Install node v16
RUN curl -s https://deb.nodesource.com/setup_16.x | bash
RUN apt-get -y install nodejs

# Create directory
WORKDIR /usr/cmwb

# compile xtext stuff
COPY ./cmlang/src ./cmlang
# create a failure when not all files are copied due to path length limitations; This is probably the longest path.
# if you run into this, start the build with an explicit path starting with \\?\
# docker build \\?\D:\path -t cmwb 
RUN cat ./cmlang/info.computationalmodeling.lang.codegen.parent/info.computationalmodeling.lang.codegen.compiler/src/main/java/info/computationalmodeling/codegen/compiler/ComputationalModelingCompiler.java

# install language code generation tools
WORKDIR /usr/cmwb/cmlang/info.computationalmodeling.lang.codegen.parent
# TODO: look for smarter ways to handle the line ending issues on Windows
RUN dos2unix ./gradlew
RUN chmod a+x ./gradlew
RUN ./gradlew installdist
RUN mkdir -p /usr/cmwb/webapp/codegen
RUN cp -r ./info.computationalmodeling.lang.codegen.compiler/build/install/info.computationalmodeling.lang.codegen.compiler/* /usr/cmwb/webapp/codegen/


# Python tools
# install the python tools
WORKDIR /usr/cmwb/python
COPY ./cmlib/packages ./
COPY ./cmtrace/package ./
RUN mkdir -p /usr/cmwb/webapp/bin/python
WORKDIR /usr/cmwb/webapp/bin/python
RUN python3 -m venv compmod_env
COPY ./python/installpackages.sh /usr/cmwb/python/installpackages.sh
RUN dos2unix /usr/cmwb/python/installpackages.sh
RUN chmod a+x /usr/cmwb/python/installpackages.sh
RUN /usr/cmwb/python/installpackages.sh /usr/cmwb/python
COPY ./python/binscripts /usr/cmwb/webapp/bin/python/
RUN dos2unix /usr/cmwb/webapp/bin/python/*
RUN chmod a+x /usr/cmwb/webapp/bin/python/*


WORKDIR /usr/cmwb/webapp
COPY ./webapplication/webapp/*.json ./
COPY ./webapplication/webapp/*.js ./
RUN npm install

# copy the app source
COPY ./webapplication/webapp/src ./src
COPY ./webapplication/webapp/static ./static
COPY ./webapplication/webapp/exercises ./exercises

# record commit hash and date
COPY ./.git /usr/cmwb/
RUN git rev-parse main > commithash.txt && \
    NOW=$(date +"%m-%d-%Y %T") && \
    COMMITHASH=$(tr -d '\n' < commithash.txt) && \
    BUILDJSON=./src/config/distconfig/build.json && \
    echo "{" > $BUILDJSON && \
    echo "  \"date\": \"$NOW\"," >> $BUILDJSON && \
    echo -n "  \"commit\": \"" >> $BUILDJSON && \
    echo -n "$COMMITHASH" >> $BUILDJSON && \
    echo "\"" >> $BUILDJSON && \
    echo "}" >> $BUILDJSON && \
    rm commithash.txt && \
    rm -rf ./.git


# adapt the code for the docker version
RUN sed -i 's/RunningInLocalMode = false/RunningInLocalMode = true/g' ./src/config/config.ts

RUN npm run build
RUN npm run nextbuild


RUN mkdir -p /usr/cmwb/webapp/codegenoutput/previewcache
RUN mkdir /usr/cmwb/webapp/codegenoutput/temp
RUN mv /usr/cmwb/webapp/codegen /usr/cmwb/webapp/bin/
COPY ./webapplication/webapp/utils/latex2svg ./bin/latex2svg/
RUN dos2unix /usr/cmwb/webapp/bin/latex2svg/latex2svg
RUN chmod a+x /usr/cmwb/webapp/bin//latex2svg/latex2svg

EXPOSE 7000
CMD npm run startprod
