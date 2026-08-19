# Mini SaaS – Project Management Platform

A full-stack project management application built with React.js, Node.js, Express.js, and PostgreSQL.

The application allows users to manage projects and team members, assign team members to projects, track project status, deadlines, budgets, and other project information.

## About This Project

This project was developed as a demonstration of my skills and capabilities as a Full-Stack Developer.

It brings together frontend development, backend development, database design, REST API development, authentication, and responsive user interface implementation in a single application.

The project is intentionally structured to provide a solid foundation that can be extended in the future with additional features and functionality. Possible future improvements include more advanced project management features, enhanced user roles and permissions, reporting and analytics, notifications, and additional integrations.

The goal is not only to demonstrate the current functionality, but also to show how the application can evolve into a larger and more complete SaaS platform over time.

## Technologies

### Frontend

* React.js
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* PostgreSQL
* CORS

### Database

* PostgreSQL

## Requirements

Before running the application, make sure you have installed:

* Node.js
* npm
* PostgreSQL

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

## 2. Set Up the Database

Create a PostgreSQL database called:

```text
miniSaas
```

Then import the SQL dump included in the repository:

```text
database/miniSaas.sql
```

The SQL dump contains the database structure and sample data required by the application.

## 3. Configure the Backend

Open:

```text
backend_nodejs/db.js
```

Replace:

```js
user: "YOUR_USERNAME",
password: "YOUR_PASSWORD"
```

with your local PostgreSQL credentials.

The default database connection uses:

```text
Host: localhost
Port: 5432
Database: miniSaas
```

## 4. Install Backend Dependencies

Open a terminal in the backend directory:

```bash
cd backend_nodejs
npm install
```

## 5. Start the Backend

From the `backend_nodejs` directory:

```bash
npm start
```

## 6. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 7. Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will provide the local URL in the terminal, usually:

```text
http://localhost:5173
```

## Authentication

The application includes JWT-based authentication.

A demo account is included in the seed database:

```text
Username: admin
Password: cielito!1984
```

This account is provided for demonstration and testing purposes.
