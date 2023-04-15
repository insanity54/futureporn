
FROM gplane/pnpm:node16-alpine as build
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY ./package.json ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN pnpm config set network-timeout 600000 -g && pnpm install --production
WORKDIR /opt/app
COPY ./ .
RUN pnpm build
FROM gplane/pnpm:node16-alpine
RUN apk add --no-cache vips-dev

FROM gplane/pnpm:node16-alpine
RUN apk add --no-cache vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/app
COPY --from=build /opt/node_modules ./node_modules
ENV PATH /opt/node_modules/.bin:$PATH
COPY --from=build /opt/app ./
EXPOSE 5555
CMD ["pnpm", "start"]