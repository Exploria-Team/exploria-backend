FROM node:18
WORKDIR /app
ENV PORT 5000
COPY . .
RUN npm install
RUN npx prisma migrate deploy
EXPOSE 5000
CMD [ "npm", "run", "start"]
