# PenguBook

PenguBook is a full-stack application designed to manage user reservations. It consists of a backend API built with Java and Spring Boot and a frontend built with React and TypeScript.

## Features

### User Registration
- Users can register through the registration page or be registered by an admin.
- When registering through the page, the user sets a password and can access the system to view and manage their reservations.
- If registered by an admin, the user cannot log in, as no password is set.

### User Management (Admin Only)
- List all users.
- Edit user information.

### Location Management (Admin Only)
- Create new locations.
- Edit existing locations.

### Filter Available Locations by Date Range
- Users and admins can go to the dashboard and search by check-in and check-out dates.
- The system will list all available locations within the selected period.
- Once a reservation is made, the location is blocked for the specified time range.

### Reservation Management (Admin Only)
- List all reservations.
- Create and edit reservations.
- Allows registering users without passwords via this method.

### Update Own Information
- Logged-in users can edit their personal information.

## Backend
- **Language**: Java
- **Framework**: Spring Boot
- **Database**: MySQL
- User authentication and authorization using JWT.
- Role-based access control (Admin and Basic roles).
- CRUD operations for users.
- Secure password storage with BCrypt.
- RESTful API endpoints.
- Integration with MySQL database.
- Token refresh mechanism.

## Frontend
- **Language**: TypeScript
- **Framework**: React
- **Styling**: SCSS
- User-friendly interface built with React.
- Role-based navigation and access control.
- Login and signup functionality.
- Profile management (view and edit user details).
- Admin dashboard to list all users.
- Responsive design with SCSS styling.
- Toast notifications for user feedback.

## How to Run

### Prerequisites
- Node.js and npm installed.
    - Node Version 23.11.0.
- Java JDK installed.
    - JDK Version 23.
- MySQL database running locally.
- Docker (optional, for running MySQL via Docker Compose).

### Backend
1. Navigate to the `api` folder.
2. Configure the database connection in `application.properties` on `\src\main\resources\` folder.

    **About app.key and app.key.pub**  
    This project uses asymmetric RSA encryption to sign and verify authentication tokens via OAuth2/JWT.

    - `app.key` → Private key used to sign JWT tokens.  
    - `app.key.pub` → Public key used to verify JWT tokens.  

    These keys are included in the repository only to simplify local setup and testing.

    **Important**:  
    These keys are not intended for production use.  
    If you plan to deploy this project in a real environment, you must generate your own RSA key pair and replace the included files to ensure security.

3. Run the API application:


##
### Docker

1. Navigate to the root folder.
2. Run the following command
    ``` bash
    docker-compose up
    ```
##
### Frontend
1. Navigate to the `front` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```