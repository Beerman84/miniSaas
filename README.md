[readme.MD](https://github.com/user-attachments/files/31216443/readme.MD)
# Mini SaaS – Project Management Platform

A full-stack project management application built with React.js, Node.js, Express.js, and PostgreSQL.

The application allows users to manage projects and team members, assign team members to projects, track project status, deadlines, budgets, and other project information.

## Technologies

### Frontend

* React.js
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* PostgreSQL
* `pg`
* CORS

### Database

* PostgreSQL

## Project Structure

```text
project/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── backend_nodejs/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   └── miniSaas.sql
│
└── README.md
```

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

The SQL file contains the database structure, tables, sequences, constraints, and sample data required by the application.

## 3. Configure the Backend

Open:

```text
backend_nodejs/db.js
```

Replace:

```js
user: "YOURUSERNAME",
password: "YOURPASSWORD"
```

with your local PostgreSQL credentials.

For example:

```js
user: "postgres",
password: "your_postgresql_password"
```

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

This installs all dependencies listed in `package.json`.

## 5. Start the Backend

From the `backend_nodejs` directory:

```bash
npm start
```

If the project uses a different development command, use the command specified in `package.json`.

## 6. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

This installs all frontend dependencies, including React, Vite, and Tailwind CSS.

## 7. Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will provide the local URL in the terminal, usually:

```text
http://localhost:5173
```

## Demo Account

The database includes a demo user:

```text
Username: admin
```

The password is stored as a bcrypt hash in the database dump.

If authentication is required, use the demo credentials provided with the project or create a new user directly in the database.

## Notes

* `node_modules` folders are not included in the repository. They are recreated using `npm install`.
* PostgreSQL credentials are not included in the repository. They must be configured locally in `backend_nodejs/db.js`.
* The `database/miniSaas.sql` file is provided to recreate the required PostgreSQL database.
