FROM mongo:8.0.5

# Copy initialization script
COPY docker/mongodb-init/init-mongo.js /docker-entrypoint-initdb.d/

EXPOSE 27017