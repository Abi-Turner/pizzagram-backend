# Pizzagram Backend

## Introduction

Pizzagram Backend is the backend service for the Pizzagram application, providing CRUD (Create, Read, Update, Delete) operations for managing users, posts, follows, likes, and comments. This project uses PostgreSQL for data storage and includes a Docker setup for easy deployment and development.

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository

Fork the repository on GitHub and then clone your fork to your local machine.

    git clone https://github.com/yourusername/pizzagram-backend.git
    cd pizzagram-backend

### 2. Checkout the Branch

Switch to the branch you need to work on.

    git checkout your-branch-name

### 3. Create the `.env` File

Create a `.env` file in the root directory of the project with the following content:

    PGDATABASE=your_database_name
    PGUSER=your_username
    PGPASSWORD=your_password
    PGHOST=db
    PGPORT=5432
    PGADMIN_EMAIL=admin@example.com
    PGADMIN_PASSWORD=your_admin_password

### 4. Build and Start the Containers

Use Docker Compose to build and start the containers. Run this command in the project root directory where the `docker-compose.yml` file is located:

    docker-compose up -d

### 5. Verify the Containers are Running

Check that the containers are up and running using the following command:

    docker-compose ps

### 6. Access pgAdmin

Open a web browser and go to [http://localhost:8080](http://localhost:8080). Log in using the credentials provided in the `.env` file (`PGADMIN_EMAIL` and `PGADMIN_PASSWORD`).

### 7. Add the Database Server in pgAdmin

In pgAdmin, create a new server:

- Click on "Servers" in the left pane, then "Create" -> "Server".
- In the "General" tab, give the server a name (e.g., "Local Docker Postgres").
- In the "Connection" tab, enter the following details:
  - **Host name/address:** `db`
  - **Port:** `5432`
  - **Maintenance database:** `${PGDATABASE}`
  - **Username:** `${PGUSER}`
  - **Password:** `${PGPASSWORD}`
- Click "Save" to add the server.

## Using the CRUD Controllers

Pizzagram Backend provides several CRUD controllers for managing the application's data. Below is a brief overview of the available endpoints and their usage.

### Users

- **Create User:** `POST /users`
- **Get User:** `GET /users/:id`
- **Update User:** `PUT /users/:id`
- **Delete User:** `DELETE /users/:id`

### Posts

- **Create Post:** `POST /posts`
- **Get Post:** `GET /posts/:id`
- **Update Post:** `PUT /posts/:id`
- **Delete Post:** `DELETE /posts/:id`

### Follows

- **Create Follow:** `POST /follows`
- **Get Follow:** `GET /follows/:id`
- **Delete Follow:** `DELETE /follows/:id`

### Likes

- **Create Like:** `POST /likes`
- **Get Like:** `GET /likes/:id`
- **Delete Like:** `DELETE /likes/:id`

### Comments

- **Create Comment:** `POST /comments`
- **Get Comment:** `GET /comments/:id`
- **Update Comment:** `PUT /comments/:id`
- **Delete Comment:** `DELETE /comments/:id`

## Example API Usage with Postman

Here are some examples of how to interact with the API using Postman.

### Create a New User

1. Open Postman and create a new request.
2. Set the request type to `POST`.
3. Enter the URL: `http://localhost:3000/users`.
4. Go to the "Headers" tab and set `Content-Type` to `application/json`.
5. Go to the "Body" tab, select `raw`, and enter the following JSON:

    ```json
    {
      "username": "newuser",
      "email": "newuser@example.com",
      "password": "password123"
    }
    ```

6. Click "Send" to create the user.

### Get a User by ID

1. Open Postman and create a new request.
2. Set the request type to `GET`.
3. Enter the URL: `http://localhost:3000/users/1`.
4. Click "Send" to retrieve the user.

### Update a User

1. Open Postman and create a new request.
2. Set the request type to `PUT`.
3. Enter the URL: `http://localhost:3000/users/1`.
4. Go to the "Headers" tab and set `Content-Type` to `application/json`.
5. Go to the "Body" tab, select `raw`, and enter the following JSON:

    ```json
    {
      "email": "updateduser@example.com"
    }
    ```

6. Click "Send" to update the user.

### Delete a User

1. Open Postman and create a new request.
2. Set the request type to `DELETE`.
3. Enter the URL: `http://localhost:3000/users/1`.
4. Click "Send" to delete the user.

## Stopping the Containers

To stop the running containers, use the following command:

    docker-compose down

## License

This project is licensed under the MIT License. See the LICENSE file for details.
