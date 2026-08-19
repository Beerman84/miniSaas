const pool = require("./db");
const { check_is_auth } = require("./check_is_auth");

//The member controller. Notice that it always includes a check to verify that the user is authenticated.
async function getMembers(req, res) {
    if (!check_is_auth(req, res)) {return;}
    try {
        const result = await pool.query(
            "SELECT id_member, member_name, member_surname FROM members ORDER BY id_member"
        );

        res.json({
            success: true,
            members: result.rows
        });

    } catch (error) {
        console.error("Error getting members:", error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
}

//If id_member = 0, it means we are creating a new member. Otherwise, we update the member with the specified ID.
async function editMember(req, res) {
    if (!check_is_auth(req, res)) {return;}
    try {
        console.log("req: ",req.body);
        const { id_member, member_name, member_surname } = req.body;
        if (id_member==0){
            const result = await pool.query(
                "INSERT INTO members (member_name, member_surname) VALUES ($1, $2)",
                [member_name, member_surname]
            );
        } else {
            const result = await pool.query(
                "UPDATE members SET member_name=$1, member_surname=$2 WHERE id_member=$3",
                [member_name, member_surname, id_member]
            );
        }
        res.json({success: true});

    } catch (error) {
        console.error("Error getting members:", error);

        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
}
/*
    Before deleting a member, we have to check that the member is not managing any projects.
    This check is already done in React, but we also need it on the server side to prevent unauthorized or malicious requests.
*/
async function deleteMember(req, res) {
    if (!check_is_auth(req, res)) {return;}
    try {
        const id_member = req.body.id_member;
        const result_check = await pool.query(
            "SELECT EXISTS (SELECT 1 FROM projects WHERE id_assigned_team_member = $1 ) AS exists",
          [id_member]
        );
        const exists = result_check.rows[0].exists;
        if (!exists) {
            const result = await pool.query(
                "DELETE FROM members WHERE id_member=$1",
                [id_member]
            );

            res.json({
                success: true,
            });
        } else {
            res.json({success: false});
        }

    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
}

/*
    This is just to check which users are assigned to each project.
    The best approach is to retrieve all pairs of id_project and id_assigned_team_member and then use this data in React whenever needed.
*/    
async function getProjectMembers(req, res) {
    if (!check_is_auth(req, res)) {return;}
    try {
        const result = await pool.query(
            "SELECT id_project, name, id_assigned_team_member FROM projects"
        );

        res.json({
            success: true,
            projectMembers: result.rows
        });

    } catch (error) {
        console.error("Error getting members:", error);

        res.status(500).json({
            success: false,
            message: "Database error"
        });
    }
}

module.exports = {
    getMembers,
    editMember,
    deleteMember,
    getProjectMembers
};