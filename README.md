# NestJS WebSocket Chat Application

This is a NestJS-based application that implements a WebSocket chat system with user authentication. It provides endpoints for health check and WebSocket communication for sending/receiving messages in real-time.

## Features

- Real-time messaging using WebSockets.
- Health check endpoint.
- Message sending and receiving between users.
- JWT authentication (or any other authentication method as per your configuration).
  
## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- NestJS CLI (optional, for easier development)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/TNManoRanjitham/SnapTalkBackend.git
```
## 2. Install Dependencies

Run the following command to install project dependencies:

```bash
npm install
```
 ## 3. Environment Variables

Ensure you have a `.env` file at the root of your project with the necessary environment variables. For example:

```env
FRONTEND_URL=http://localhost:3000 
```
## 4. Start the Development Server

To run the application locally in development mode, use the following command:

```bash
npm run start
```

## Docker Setup Instructions

To run the application using Docker, follow these steps:

### 1. **Ensure Docker is Installed**
Ensure that Docker and Docker Compose are installed on your machine. You can download Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop). Docker Compose is included in Docker Desktop.

For more information about Docker, check the [official Docker documentation](https://docs.docker.com/).


### 2. **Build and Run the Application Using Docker**
The docker.sh script helps to build and run the application using Docker. You can execute the script using the bash or sh command:

```bash
bash build-docker.sh
```
or 
```bash
sh build-docker.sh
```

The `docker.sh` script is used to automate the build and run process for Docker. You can execute the script with either `bash docker.sh` or `sh docker.sh` based on your environment.

### 3. **Access the Application**
After successfully running the Docker container, open your browser and go to:

```bash
http://localhost:3000
```

### 4. **Stopping the Application**
To stop the application running inside Docker:

```bash
docker-compose down
```

### 5. **Clean Up After Stopping the Application**
To clean up Docker resources after the app is stopped:

```bash
docker system prune -f
```

### 6. Stop and Remove the Containers
Run the following command to stop and remove the containers:

```bash
docker-compose down
```

### 7. Rebuild the Containers
fter stopping and removing the containers, rebuild the containers with the --build flag to apply any changes you made to the Dockerfile or docker-compose.yml:
```bash
docker-compose up --build
```
This will rebuild the images and start the containers from scratch.


## Accessing Swagger Documentation

Once the application is running, you can access the Swagger API documentation at:

**Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

This provides an interactive UI where you can explore the available endpoints and their documentation.

## Running Tests

### Unit Tests

To run unit tests for the application, use the following command:

```bash
npm run test
```


