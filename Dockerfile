# Use an official Node runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install tools and libraries required for Google Chrome
RUN apt-get update && apt-get install -y curl gnupg ca-certificates --no-install-recommends && \
    curl --location --silent --output google-linux-signing-key.pub https://dl-ssl.google.com/linux/linux_signing_key.pub && \
    apt-key add google-linux-signing-key.pub && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    rm google-linux-signing-key.pub

# Add debugging output
RUN google-chrome --version || true

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Cleanup npm cache (optional)
RUN npm cache clean --force

# Add user so we don't need to run as root
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads /home/pptruser/.cache \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /usr/src/app

# Set Puppeteer's Chrome path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Copy the rest of the application source code
COPY --chown=pptruser:pptruser . .

# Expose port 3000 to the outside once the container has launched
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
