# Game Theory Task

**Submitted by:** Devangi Gajjar  
**Roll Number:** IIB2021037

This application allows customers to book sports facilities across various centers and enables managers to manage bookings efficiently. It utilizes **PostgreSQL** as the database, with **Prisma** as the ORM for database management.

[Report](report.pdf)

---

## Database Schema

The app’s database schema is structured as follows:

### User

- **userId:** `Int` (Primary Key, Auto-increment)
- **name:** `String`
- **email:** `String` (Unique)
- **password:** `String`
- **role:** `Role` (Enum, Default: CUSTOMER)
- **mobileNumber:** `String`
- **slots:** Relation to the Slot model

### Manager

- **managerId:** `Int` (Primary Key, Auto-increment)
- **name:** `String`
- **email:** `String` (Unique)
- **password:** `String`
- **role:** `Role` (Enum, Default: MANAGER)
- **centre:** Relation to the Centre model
- **centreId:** `Int` (Foreign Key)

### Centre

- **centreId:** `Int` (Primary Key, Auto-increment)
- **name:** `String`
- **location:** `String`
- **courts:** Relation to the Court model
- **managers:** Relation to the Manager model

### Court

- **courtId:** `Int` (Primary Key, Auto-increment)
- **centre:** Relation to the Centre model
- **centreId:** `Int` (Foreign Key)
- **sport:** `Sports` (Enum)
- **courtNumber:** `Int`
- **slots:** Relation to the Slot model

### Slot

- **slotId:** `Int` (Primary Key, Auto-increment)
- **court:** Relation to the Court model
- **courtId:** `Int` (Foreign Key)
- **isOccupied:** `Boolean` (Default: false)
- **time:** `Int`
- **date:** `DateTime`
- **user:** Relation to the User model (Optional)
- **userId:** `Int` (Foreign Key, Optional)

### Enums

- **Sports:** BADMINTON, SWIMMING, TABLE_TENNIS, CRICKET, FOOTBALL
- **Role:** CUSTOMER, MANAGER

---

## API Endpoints

### Authentication

- **POST /customer/login:** Customer login
- **POST /customer/register:** Customer registration
- **POST /management/login:** Manager login

### Customer Operations

- **GET /customer/slots:** View booked slots (requires authentication and `CUSTOMER` role)
- **POST /customer/book:** Book a slot (requires authentication and `CUSTOMER` role)
- **DELETE /:slotId:** Delete a booked slot (requires authentication)
- **POST /customer/available:** View available slots (requires authentication and `CUSTOMER` role)

### Manager Operations

- **POST /manager:** View center slots (requires authentication and `MANAGER` role)

---

## Deployment

### Backend

- **Backend URL:** [https://game-theory-task-backend.onrender.com](https://game-theory-task-backend.onrender.com)

### Frontend

- **Frontend Customer URL:** [https://game-theory-task-frontend.vercel.app](https://game-theory-task-frontend.vercel.app)
- **Frontend Manager URL:** [https://gtm-manager1-5gb0lylq1-rukia-ds-projects.vercel.app](https://gtm-manager1-5gb0lylq1-rukia-ds-projects.vercel.app)

---

## Running the Application

### Backend (Express.js)

1. Install dependencies:
    npm i

2. Setup .env
    JWT_SECRET=<jwt_secret_value>
    DATABASE_URL=<postgresql_database_connection_url>

2. Start the server:
    npm start

3. The server will run on:  
    `localhost:8006`

### Frontend (React)

1. Install dependencies:
    npm i
    
2. Setup .env
    REACT_APP_USER_ROLE="CUSTOMER" (For Customer View)
    REACT_APP_USER_ROLE="MANAGER" (For Manager View)

3. Start the frontend:
    npm start
    
4. The app will run on:  
    `localhost:3000`

---

## Tech Stack

- **Frontend:** React with Axios for API integration
- **Backend:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma

---

## Assumptions and Limitations

1. **Authentication:**
   - Authentication is fully functional on the backend but has not been implemented on the frontend due to time constraints.
   - There are different hosted websites to access the webapp as a manager and as a customer, as a workaround.

2. **Game Theory Centers and Sports:**
   - The app operates with 7 predefined Game Theory center locations:
     - 'Indira Nagar', 'HSR Layout', 'Electronic City', 'Whitefield', 'RT Nagar', 'Bagalur', and 'Kaggadasapura'
   - The 5 available sports are:
     - BADMINTON, SWIMMING, TABLE_TENNIS, CRICKET, FOOTBALL
   - The number of fields/resources per game per center is randomly generated between 1 and 4.

3. **User Types:**
   - The app has two user types: **Customer** and **Manager**.
   - Each center has a manager, and their credentials are pre-populated in the database.

4. **Hosting:**
   - The backend is hosted on **Render**, the frontend is hosted on **Vercel**, and the database on **Aiven**.
   - Since free-tier hosting is being used, performance may be slower.

5. **Role Authorization:**
   - Middleware is implemented to ensure that customers and managers can only access their respective APIs.
