FROM nginx:1.19
MAINTAINER test-pre-ui
RUN echo "192.168.2.100 pre.service" >> /etc/hosts
COPY dist.conf /etc/nginx/conf.d/dist.conf
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm  /etc/nginx/conf.d/default.conf -rf
ADD *.tar /home/
# tar cvf dist.tar dist 打tar包
