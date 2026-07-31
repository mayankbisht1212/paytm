FROM node:20-alpine3.19
WORKDIR usr/src/app
COPY package.json package-lock.json turbo.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm install
RUN npm run db:generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start-user-app"]