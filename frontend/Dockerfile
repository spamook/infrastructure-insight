FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template


ENV BACKEND_HOST=localhost
ENV BACKEND_PORT=3001
EXPOSE 80
CMD ["/bin/sh", "-c", \
  "sed -e 's/BACKEND_HOST/'\"$BACKEND_HOST\"'/g' \
       -e 's/BACKEND_PORT/'\"$BACKEND_PORT\"'/g' \
       /etc/nginx/conf.d/default.conf.template \
       > /etc/nginx/conf.d/default.conf \
  && nginx -g 'daemon off;'"]