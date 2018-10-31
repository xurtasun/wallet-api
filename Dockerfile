FROM node:10.12.0-alpine
MAINTAINER Xavier Urtasun <xavi.urta@gmail.com>

RUN     mkdir /usr/app

COPY    ./ /usr/app/

RUN     cd /usr/app/ && \
        npm install

WORKDIR /usr/app/

CMD     ["npm", "start"]
        
