import { useEffect, useState } from "react";
//import { formatTimestamp } from "./CommonFunctions";

function ManageTeamMembers({ setAuthenticated, setPageMaster, setMenuLaterale, setToastMessage }) {
    useEffect(() => {
        //setMenuLaterale(menu_members);
        setMenuLaterale(null);
        //setPageMaster(null);
        setPageMaster(<TeamMembersList />)
    }, []);

    //I'm just working on a submenu, but it isn't necessary if we only have "List" and "Add".
    const menu_members = (
        <>
            <button onClick={() => setPageMaster(<TeamMembersList />)}>Team Members List</button>
            <button onClick={() => setPageMaster(<NewTeamMember />)}>New Team Member</button>
        </>
    );

    function TeamMembersList(){
        const [members, setMembers] = useState([]);
        const [project_members, setProject_members] = useState([]);

        useEffect(() => {
            async function loadMembers() {
                const response = await fetch(
                    "http://localhost:3000/api/members_list"
                    ,{
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
                if (response.status === 401) {setAuthenticated(false);return;}
                const data = await response.json();
                //console.log("lista membri: ",data);
                if (data.success) {
                    setMembers(data.members);
                    loadProjectMembers();
                }
            }

            //We load the project members so that, for each member, we can display a list of their projects.
            async function loadProjectMembers() {
                const response = await fetch(
                    "http://localhost:3000/api/member_projects"
                    ,{
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
                if (response.status === 401) {setAuthenticated(false);return;}
                const data = await response.json();
                //console.log("lista membri progetti: ",data);
                if (data.success) {
                    setProject_members(data.projectMembers);
                }
            }

            loadMembers();
        }, []);

        //Deleting a member: note that you can't delete a member if they have an assigned project. There is a check in the Node.js memberController.js file.
        async function handleDeleteMember(id_member) {
            const response = await fetch(
                "http://localhost:3000/api/delete_member",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_member: id_member
                    })
                }
            );

            if (response.status === 401) {
                setAuthenticated(false);
                return;
            }

            const data = await response.json();

            if (data.success) {
                setToastMessage("Member deleted!");
                setPageMaster(<TeamMembersList key={Date.now()} />);
            } else {
                setToastMessage("you can't delete it!");
                setPageMaster(<TeamMembersList key={Date.now()} />);
            }
        }

        return (
            <div>
            <div className="pagemaster_titolo">Team Members List</div>
                <button className="btn-add" onClick={() => setPageMaster(<NewTeamMember />)}>New Team Member</button>
            <div className="mt-4 min-w-[440px] w-fit rounded-md border border-slate-200">
            <table className="project-form-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Assigned Projects</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <SingleRowMember
                            key={member.id_member}
                            id_member={member.id_member}
                            members={members}
                            project_members={project_members}
                            handleDeleteMember={handleDeleteMember}
                        />
                    ))}
                </tbody>
            </table>
        </div>
        </div>
        );
    }

    //Use a React component that can be reused inside some find functions.
    function SingleRowMember({id_member, members, project_members, handleDeleteMember}){
        const member_temp = members.find(
            member_temp => Number(member_temp.id_member) === Number(id_member)
        );

        const assignedProjects = project_members.filter(
            project =>
                Number(project.id_assigned_team_member) === Number(id_member)
        );

        return (
            <tr key={id_member}>
                <td data-label="Name">{member_temp.member_name}</td>
                <td data-label="Surname">{member_temp.member_surname}</td>
                <td data-label="Assigned Projects">
                    {assignedProjects.length > 0 ? (
                        assignedProjects.map((project, index) => (
                            <div className="pl-4 -indent-4">
                                • {project.name}
                            </div>
                        ))
                    ) : ("")}
                </td>
                <td>
                    <div className="table-options">
                <button className="btn-edit" onClick={() => setPageMaster(
                    <EditTeamMember
                        members={members}
                        id_member={id_member}
                    />)}
                > Edit </button>

                {assignedProjects.length <= 0 ? (
                    <button className="btn-delete"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this member?")) {
                                handleDeleteMember(id_member);
                            }
                        }}
                    > Delete </button>
                    ) : ("")}
                    </div>
                </td>
            </tr>
        )
    }

    
    function EditTeamMember({members, id_member}) {
        const member = members.find(
            member => Number(member.id_member) === Number(id_member)
        );

        const [member_name, setName] = useState(
            member ? member.member_name : ""
        );

        const [member_surname, setSurname] = useState(
            member ? member.member_surname : ""
        );

        return(
            <div className="form_semplice">
                <div className="pagemaster_titolo">New Team Member</div>
                <form onSubmit={handleEditMember}>
                    <div className="mt-4 min-w-[440px] w-fit rounded-md border border-slate-200">
                        <table className="project-form-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Name">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Name"
                                            value={member_name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </td>
                                    <td data-label="Surname">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Surname"
                                            value={member_surname}
                                            onChange={(e) => setSurname(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br /><button type="submit" className="btn-edit">
                        Edit member
                    </button>
                </form>
            </div>
        );

        async function handleEditMember(e) {
            e.preventDefault();
            const response = await fetch(
                "http://localhost:3000/api/edit_member"
                ,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_member: id_member,
                        member_name: member_name,
                        member_surname: member_surname
                    })
                }
            );


            if (response.status === 401) {setAuthenticated(false);return;}

            const data = await response.json();
            console.log(data);
            if (data.success){
                setToastMessage("Member edited!");
                setPageMaster(<TeamMembersList key={Date.now()} />);
            }
        }
    }

    function NewTeamMember() {
    	const [member_name, setName] = useState("");
        const [member_surname, setSurname] = useState("");
        const [id_member, setId_member] = useState("0");

        return(
            <div className="form_semplice">
                <div className="pagemaster_titolo">New Team Member</div>
                <form onSubmit={handleSubmitNewMember}>
                    <div className="mt-4 min-w-[440px] w-fit rounded-md border border-slate-200">
                        <table className="project-form-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Surname</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Name">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Name"
                                            value={member_name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </td>
                                    <td data-label="Surname">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Surname"
                                            value={member_surname}
                                            onChange={(e) => setSurname(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br /><button type="submit" className="btn-add">
                        Insert member
                    </button>
                </form>
            </div>
        );

        async function handleSubmitNewMember(e) {
            e.preventDefault();
            const response = await fetch(
                "http://localhost:3000/api/edit_member"
                ,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_member: id_member,
                        member_name: member_name,
                        member_surname: member_surname
                    })
                }
            );


            if (response.status === 401) {setAuthenticated(false);return;}

            const data = await response.json();
            console.log(data);
            if (data.success){
                setToastMessage("Member inserted!");
                setPageMaster(<TeamMembersList key={Date.now()} />);
            }
        }
    }
}
export default ManageTeamMembers;