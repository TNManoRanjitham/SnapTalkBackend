#!/bin/bash

# Step 1: Install dependencies using npm
echo "Installing npm dependencies..."
npm install

# Step 2: Build the Docker image using Docker Compose
echo "Building the Docker image using Docker Compose..."
docker-compose build

# Step 3: Run the application using Docker Compose
echo "Running the application using Docker Compose..."
docker-compose up -d

echo "The app is now running at http://localhost:3001"
