# Step 1: Use official Node.js image as base
FROM node:22-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install 

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 7: Expose the port that the NestJS app will run on
EXPOSE 3001

# Step 8: Set the command to start the application
CMD ["npm", "run", "start"]
