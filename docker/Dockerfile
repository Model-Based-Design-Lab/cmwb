FROM ubuntu:24.04

WORKDIR /usr
ENV TZ=Europe/Amsterdam
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa -y
# Python needs to be limited to version 3.10 it seems for compatibility with the pygraph module
RUN apt-get update && apt-get install -y \
    python3.10 python3.10-venv python3.10-dev \
    default-jdk dos2unix graphviz build-essential \
    libssl-dev libffi-dev libcairo2-dev curl git unzip


# Install Maven 3.9.9
RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz -o /tmp/apache-maven-3.9.9-bin.tar.gz \
    && tar -xzf /tmp/apache-maven-3.9.9-bin.tar.gz -C /opt \
    && ln -s /opt/apache-maven-3.9.9 /opt/maven \
    && ln -s /opt/maven/bin/mvn /usr/bin/mvn

# Install node v16
RUN curl -s https://deb.nodesource.com/setup_16.x | bash
RUN apt-get -y install nodejs

# Create directory
WORKDIR /usr/cmwb

# compile xtext stuff
COPY ./cmlang/src ./cmlang

# install language code generation tools
WORKDIR /usr/cmwb/cmlang/info.computationalmodeling.lang.parent
RUN mvn install
RUN mkdir -p /usr/cmwb/webapp/codegen
RUN cp -r ./info.computationalmodeling.lang.codegen/target/cm-codegen-1.0.0-SNAPSHOT-unix.zip /usr/cmwb/webapp/codegen/
RUN unzip /usr/cmwb/webapp/codegen/cm-codegen-1.0.0-SNAPSHOT-unix.zip -d /usr/cmwb/webapp/codegen/
RUN dos2unix /usr/cmwb/webapp/codegen/bin/cm-codegen
RUN chmod a+x /usr/cmwb/webapp/codegen/bin/cm-codegen

# Python tools
# install the python tools
WORKDIR /usr/cmwb/python
COPY ./cmlib/packages ./
COPY ./cmtrace/package ./
RUN mkdir -p /usr/cmwb/webapp/bin/python
WORKDIR /usr/cmwb/webapp/bin/python
RUN python3.10 -m venv compmod_env
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
RUN sed -i 's/RunningInContainerMode = false/RunningInContainerMode = true/g' ./src/config/config.ts

RUN npm run build
RUN npm run nextbuild


RUN mkdir -p /usr/cmwb/webapp/codegenoutput/previewcache
RUN mkdir /usr/cmwb/webapp/codegenoutput/temp
RUN mv /usr/cmwb/webapp/codegen /usr/cmwb/webapp/bin/
COPY ./webapplication/webapp/utils/latex2svg ./bin/latex2svg/
RUN dos2unix /usr/cmwb/webapp/bin/latex2svg/latex2svg
RUN chmod a+x /usr/cmwb/webapp/bin//latex2svg/latex2svg

EXPOSE 7000
CMD ["npm", "run", "startprod"]
