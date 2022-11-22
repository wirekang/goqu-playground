FROM nginx:latest

ENV TZ=Asia/Seoul

RUN rm -rf /etc/nginx/conf.d/
RUN rm -f /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
