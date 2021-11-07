FROM node
COPY archive/ /var/www/app

EXPOSE 3000
ENV PORT=3000
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build and set up
RUN cd /var/www/app && \
    npm install

# Run
CMD cd /var/www/app && npm run dev
