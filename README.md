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


