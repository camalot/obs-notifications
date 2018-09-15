FROM node:boron

# Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/

RUN mkdir -p /databases && \
	mkdir -p /app/data && \
	mkdir -p /data && \
	ln -s /data/labels /app/data/labels && \
	ln -s /databases /app/databases && \
	ln -s /data/pb /app/data/pb

RUN npm install

# Bundle app source
COPY . /app

EXPOSE 3000

VOLUME [ "/data" ]
VOLUME [ "/databases" ]

ENTRYPOINT ["npm", "start"]
