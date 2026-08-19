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

## Demo Account
The database includes a demo user:
```text
Username: admin
Password: cielito!1984
```

The password is stored as a bcrypt hash in the database dump.
