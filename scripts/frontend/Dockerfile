FROM node:18
EXPOSE 8080
WORKDIR /app
COPY ./ .
RUN npm install --legacy-peer-deps
RUN npm install -g serve
RUN yarn run build
ENV NODE_ENV=production
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
