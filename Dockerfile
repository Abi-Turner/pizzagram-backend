# Dockerfile for Node.js server
FROM node:14

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application code
COPY . .



# Expose port on which your Node.js server runs
EXPOSE 3000

# Command to run your Node.js server
CMD ["npm", "start"]
