FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN mkdir -p /data && \
	mkdir -p /usr/src/app/data && \
	ln -s /data /usr/src/app/data

RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

VOLUME [ "/data" ]

ENTRYPOINT ["npm", "start"]
