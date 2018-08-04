FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN mkdir -p /databases && \
	ln -s /databases /usr/src/app/databases

RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

VOLUME [ "/data" ]
VOLUME [ "/databases" ]

ENTRYPOINT ["npm", "start"]
