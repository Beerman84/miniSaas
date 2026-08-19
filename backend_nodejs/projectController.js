const pool = require("./db");
const { check_is_auth } = require("./check_is_auth");

//The project controller. Notice that it always includes a check to verify that the user is authenticated.
async function getProjects(req, res) {
    if (!check_is_auth(req, res)) {return;}
    try {
        const result = await pool.query(
            "SELECT * FROM projects ORDER BY ts_deadline"
        );
        res.json({
            success: true,
            projects: result.rows
        });

    } catch (error) {
        console.error("Error getting projects:", error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
}


async function deleteProject(req, res) {
    if (!check_is_auth(req, res)) {return;}
    try {
        console.log("req pcontroller: ",req.body);
        const id_project = req.body.id_project;
        const result = await pool.query(
            "DELETE FROM projects WHERE id_project=$1",
            [id_project]
        );
        res.json({
            success: true,
            message: "Deleted with success"
        });

    } catch (error) {
        console.error("Error getting members:", error);

        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
}

//If id_project = 0, it means we are creating a new project. Otherwise, we update the project with the specified ID.
async function editProject(req, res) {
    if (!check_is_auth(req, res)) {return;}
    try {
        console.log("req pcontroller: ",req.body);
        const {name, status, deadline, id_assigned_team_member,budget,details} = req.body;
        const ts_deadline = BigInt(Math.floor(new Date(deadline).getTime() / 1000));
        const now = BigInt(Math.floor(Date.now() / 1000));
        const id_project=Number(req.body.id_project);
        if (id_project==0){
            const result = await pool.query(
                "INSERT INTO projects (name, status, ts_deadline, id_assigned_team_member, budget, ts_creation, details) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [name, status, ts_deadline, id_assigned_team_member, budget, now, details]
            );
            res.json({
                success: true,
                message: "Inserted with success"
            });
        } else {
            const result = await pool.query(
                "UPDATE projects SET name=$1, status=$2, ts_deadline=$3, id_assigned_team_member=$4, budget=$5, details=$6 WHERE id_project=$7",
                [name, status, ts_deadline, id_assigned_team_member, budget, details, id_project]
            );

            res.json({
                success: true,
                message: "Updated with success"
            });
        }

    } catch (error) {
        console.error("Error getting members:", error);

        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
}

module.exports = {
    getProjects,
    editProject,
    deleteProject
};