# Use the official Playwright image (pinned to match @playwright/test version)
FROM mcr.microsoft.com/playwright:v1.63.0-noble

# Use the pre-created 'pwuser' from the base image (running as root is a security anti-pattern)
USER pwuser

# Set the working directory
WORKDIR /home/pwuser/app

# Copy dependency files first for better Docker layer caching
COPY --chown=pwuser:pwuser package.json package-lock.json ./

# Install dependencies using the lockfile
RUN npm ci

# Copy the rest of the project
COPY --chown=pwuser:pwuser . .

# Default command runs the full test suite
CMD ["npx", "playwright", "test"]