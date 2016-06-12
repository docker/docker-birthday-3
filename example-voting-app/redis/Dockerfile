FROM redis:alpine

EXPOSE 6379
COPY redis.conf /usr/local/etc/redis/
ENTRYPOINT ["redis-server", "/usr/local/etc/redis/redis.conf"]
