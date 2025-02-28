FROM node:18
EXPOSE 8080
WORKDIR /app
COPY ./ .
RUN npm install --legacy-peer-deps
RUN npm install -g serve
RUN yarn install

# Update Browserslist database
RUN npx update-browserslist-db@latest

# Add missing Babel plugin
RUN yarn add --dev @babel/plugin-proposal-private-property-in-object

# Run the build command and capture logs
RUN yarn run build --verbose
ENV NODE_ENV=production
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]