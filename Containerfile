FROM registry.access.redhat.com/ubi10/nodejs-24 AS base

WORKDIR /pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN curl -fsSL https://get.pnpm.io/install.sh | bash -
COPY --chown=1001 . /app
WORKDIR /app

RUN pnpm install --frozen-lockfile && \
    pnpm run build

FROM registry.access.redhat.com/ubi10/nginx-126
COPY nginx.conf ${NGINX_CONF_PATH}
COPY mime.types /etc/nginx/mime.types
COPY --from=base /app/dist /app

CMD ["nginx", "-g", "daemon off;"]
