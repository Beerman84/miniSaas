const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const pool = require("./db");

const {
    getMembers,
    editMember,
    deleteMember,
    getProjectMembers
} = require("./memberController");

const {
    getProjects,
    editProject,
    deleteProject
} = require("./projectController");

const app = express();
const PORT = 3000;

//I’m using this port for React.
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use(session({
    secret: "GreatSecretForYou",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000  //on hour of cookie
    }
}));

//just test
app.get("/", (req, res) => {
    res.json({
        message: "Hello from Node.js!"
    });
});

// Authentication check; But there is a file (check_is_auth.js) that checks every time whether the user is logged in or not.
app.get("/api/check_logged", (req, res) => {
    //console.log("LOGIN SESSION:", req.session);
    if (req.session && req.session.id_user) {
        return res.json({
            authenticated: true,
            id_user: req.session.id_user
        });
    }
    return res.json({
        authenticated: false
    });
});

//Classic GET and POST requests to call functions inside Node.js files.
app.get("/api/members_list", getMembers);
app.post("/api/edit_member", editMember);
app.post("/api/delete_member", deleteMember);

app.get("/api/projects", getProjects);
app.post("/api/edit_project", editProject);
app.post("/api/delete_project", deleteProject);

app.get("/api/member_projects", getProjectMembers);

//Login request: First, I search for the user, then I hash the password to check whether it is correct.
app.post("/api/login", async (req, res) => {
    //console.log("trying to login...", req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    try {
        const result = await pool.query(
            "SELECT id_user, username, password FROM users WHERE username = $1",
            [username]
        );

        //Check if the user exist
        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Wrong username or password"
            });
        }
        const user = result.rows[0];
        const hashedPassword = await bcrypt.hash(password, 10);
        //console.log("Hashed password:", hashedPassword);

        //after hasing password, check if is correct
        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Wrong username or password"
            });
        }

        // Login successful!
        req.session.id_user = user.id_user;
        return res.json({
            success: true,
            id_user: user.id_user
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});