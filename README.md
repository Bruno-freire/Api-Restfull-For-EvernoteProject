# Introduction
This is a RESTful API built with Node.js and Express. It provides endpoints to manage notes and users. The API uses MongoDB to store data.

# Endpoints

/users

    POST /users/signup - creates a new user with a unique email and encrypted password.
    POST /users/login - authenticates an existing user and returns a JWT token to be used for protected endpoints.

/notes

Protected endpoints. JWT token must be included in the headers of all requests.

    GET /notes - retrieves all notes associated with the authenticated user.
    POST /notes - creates a new note associated with the authenticated user.
    GET /notes/search?query={query} - searches the authenticated user's notes for the specified query string.
    GET /notes/:id - retrieves a specific note by ID if it is associated with the authenticated user.
    PUT /notes/:id - updates a specific note by ID if it is associated with the authenticated user.

Authentication

The API uses JSON Web Tokens (JWT) for authentication. A token is returned after a successful login request. The token must be included in the headers of all protected endpoint requests with the key x-access-token.

# Models

User

A user has the following properties:

    name - string (optional)
    email - string (required, unique)
    password - string (required, encrypted)
    createdAt - date (default: Date.now())
    updateAt - date (default: Date.now())

Note

A note has the following properties:

    title - string
    body - string
    createdAt - date (default: Date.now())
    updateAt - date (default: Date.now())
    auth - object ID (refers to the associated User)
