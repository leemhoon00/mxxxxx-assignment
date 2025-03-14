FROM node:20-alpine3.18 AS build
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

FROM node:20-alpine3.18
EXPOSE 3000
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/package-lock.json /app/package-lock.json
RUN npm install --omit=dev
CMD ["npm", "run", "start:prod"]