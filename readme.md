# Freelance Marketplace

A MERN stack application that connects freelancers with clients, allowing them to post jobs, find freelancers, and manage contracts.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Documentation URL](#documentationurl)

## Features

- **User Authentication**: Clients and freelancers can register and log in.
- **Job Posting**: Clients can post job listings with details such as title, description, budget, and skills required.
- **Freelancer Search**: Clients can search for freelancers based on skills and ratings.
- **Contract Management**: Clients and freelancers can manage contracts, including milestones and status updates.
- **Reviews and Ratings**: Clients can leave reviews and ratings for freelancers after project completion.

## Technologies Used

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Installation

1. **Clone the repository**:

   ```bash
    git clone


   ```

2. **Navigate to the project directory**:

   ```bash

       cd backend

   ```

3. **Install the dependencies**:

   ```bash

       npm install

   ```

4. **Set up environment variables in a .env file**:

   ```bash

        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        PORT=your_port_number
        EMAIL_USER=your_email_username
        EMAIL_PASS=your_email_password
        NODE_EN===your_node_en

   ```

5. **Start the server**:

   ```bash

        npm start

   ```

## API Endpoints

## API Endpoints

**User Authentication**
POST /api/v1/auth/register: Register a new user (client or freelancer).
POST /api/v1/auth/login: Log in a user.

**Job Management**
POST /api/v1/jobs: Create a new job listing.
GET /api/v1/jobs: Retrieve all job listings.

**Freelancer Management**
GET /api/v1/freelancers: Retrieve all freelancers.

**Contract Management**
POST /api/v1/contracts: Create a new contract.
GET /api/v1/contracts: Retrieve all contracts.

## Error Handling

Proper error handling is implemented to ensure meaningful error messages are returned for various scenarios (e.g., invalid credentials, User not found).

## Documentation URL

[POSTMAN API Documentation URL: ](https://documenter.getpostman.com/view/40014100/2sAYkHoJ3A)
