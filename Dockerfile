FROM node:boron

# Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/

RUN mkdir -p /databases && \
	ln -s /databases /app/databases

RUN npm install

# Bundle app source
COPY . /app

EXPOSE 3000

VOLUME [ "/data" ]
VOLUME [ "/databases" ]

ENTRYPOINT ["npm", "start"]
