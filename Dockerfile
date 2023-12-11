FROM node:20.9.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DB_NAME=testing-express
ENV SECRET_KEY=1840175hsdnklasO11WAZXCdSIDIQUBAasSDBNP23123EQ21jsa1ASDKNAD82131maqwNQEIJQWasda
EXPOSE 8080
CMD ["npm", "run", "start"]