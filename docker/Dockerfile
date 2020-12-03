FROM nginx:1.19
MAINTAINER test-pre-ui
COPY dist.conf /etc/nginx/conf.d/dist.conf
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm  /etc/nginx/conf.d/default.conf -rf
ADD *.tar /home/
