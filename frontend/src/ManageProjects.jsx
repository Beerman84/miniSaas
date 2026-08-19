import { useEffect, useState } from "react";
import Select from "react-select";
import { formatTimestamp } from "./CommonFunctions";
import { formatBudget } from "./CommonFunctions";
import DatePicker, { registerLocale } from "react-datepicker";
import { useLocation } from "react-router-dom";

function ManageProjects({ setAuthenticated, setPageMaster, setMenuLaterale, setToastMessage }) {
    const [members, setMembers] = useState(null);

    useEffect(() => {//viene richiamato all'inizio. Quindi appena richiesto da dashboard, si attiva
        //setMenuLaterale(menu_projects);
        setMenuLaterale(null);
        //setPageMaster(null);
        setPageMaster(<ProjectList />)
    }, []);

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
            return data.members;
        }
    }

    //I'm just working on a submenu, but it isn't necessary if we only have "List" and "Add".
    const menu_projects = (
        <>
            <button onClick={() => setPageMaster(<ProjectList />)}>Projects List</button>
            <button onClick={() => setPageMaster(<NewProject />)}>New Project</button>
        </>
    );

    function ProjectList(){
        const [projects, setProjects] = useState([]);
        const [members, setMembers] = useState([]);

        //filtering block
        const [sortConfig, setSortConfig] = useState({
            key: null,
            direction: "asc"
        });
        const [showFilters, setShowFilters] = useState(false);
        const [searchTerm, setSearchTerm] = useState("");
        const [statusFilter, setStatusFilter] = useState("");
        const [deadlineFilter, setDeadlineFilter] = useState("");
        const [budgetMin, setBudgetMin] = useState("");
        const [budgetMax, setBudgetMax] = useState("");
        const [memberFilter, setMemberFilter] = useState("");

        /*
            We start by loading the projects and their members,
            so that we can directly see each team members are assigned to each project.
        */
        useEffect(() => {
            async function loadprojects() {
                const response = await fetch(
                    "http://localhost:3000/api/projects"
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
                //console.log("lista progetti: ",data);
                if (data.success) {
                    setProjects(data.projects);
                    loadMembersTemp();
                }
            }

            async function loadMembersTemp() {
                const lista = await loadMembers();
                setMembers(lista);
            }

            loadprojects();
        }, []);

        //A function to sort the projects.
        function handleSort(key) {
            setSortConfig((current) => ({
                key,
                direction:
                    current.key === key && current.direction === "asc"
                        ? "desc"
                        : "asc"
            }));
        }

        //All search filters.
        const filteredProjects = projects.filter((project) => {
            const matchesName = String(project.name ?? "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "" ||
                project.status === statusFilter;

            const matchesDeadline =
                checkDeadline(project.ts_deadline, deadlineFilter);

            const budget = Number(project.budget);

            const matchesBudgetMin =
                budgetMin === "" ||
                budget >= Number(budgetMin);

            const matchesBudgetMax =
                budgetMax === "" ||
                budget <= Number(budgetMax);

            const matchesMember =
                memberFilter === "" ||
                Number(project.id_assigned_team_member) === Number(memberFilter);

            return (
                matchesName &&
                matchesStatus &&
                matchesDeadline &&
                matchesBudgetMin &&
                matchesBudgetMax &&
                matchesMember
            );
        });

        /*
            It’s a function that filters only to check the deadline using the timestamp.
            The timestamp is always a BigInt without milliseconds.
        */
        function checkDeadline(deadline, filter) {
            if (filter === "") {return true;}

            if (!deadline) {return false;}

            const deadlineDate = new Date(Number(deadline) * 1000);
            const today = new Date();

            // Remove the time portion
            today.setHours(0, 0, 0, 0);
            deadlineDate.setHours(0, 0, 0, 0);

            if (filter === "overdue") {return deadlineDate < today;}
            if (filter === "today") {return deadlineDate.getTime() === today.getTime();}
            if (filter === "next7") {
                const next7 = new Date(today);
                next7.setDate(today.getDate() + 7);
                return deadlineDate >= today && deadlineDate <= next7;
            }

            if (filter === "next30") {
                const next30 = new Date(today);
                next30.setDate(today.getDate() + 30);
                return deadlineDate >= today && deadlineDate <= next30;
            }
            return true;
        }

        //After filtering the projects, we sort them based on the sortingKey.
        const sortedProjects = [...filteredProjects].sort((a, b) => {
            if (!sortConfig.key) {
                return 0;
            }

            if (sortConfig.key === "budget") {
                const aBudget = Number(a.budget);
                const bBudget = Number(b.budget);

                return sortConfig.direction === "asc"
                    ? aBudget - bBudget
                    : bBudget - aBudget;
            }

            let aValue;
            let bValue;

            if (sortConfig.key === "team_member") {
                const memberA = members.find(
                    member =>
                        Number(member.id_member) ===
                        Number(a.id_assigned_team_member)
                );

                const memberB = members.find(
                    member =>
                        Number(member.id_member) ===
                        Number(b.id_assigned_team_member)
                );

                aValue = memberA
                    ? `${memberA.member_name} ${memberA.member_surname}`
                    : "";

                bValue = memberB
                    ? `${memberB.member_name} ${memberB.member_surname}`
                    : "";
            } else {
                aValue = a[sortConfig.key];
                bValue = b[sortConfig.key];
            }

            return sortConfig.direction === "asc"
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });

        //This just populates the member sorting <select>.
        const sortedMembers = [...members].sort((a, b) => {
            const nameA = `${a.member_name} ${a.member_surname}`;
            const nameB = `${b.member_name} ${b.member_surname}`;

            return nameA.localeCompare(nameB);
        });

        async function handleDeleteProject(id_project) {
            const response = await fetch(
                "http://localhost:3000/api/delete_project",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_project: id_project
                    })
                }
            );

            if (response.status === 401) {
                setAuthenticated(false);
                return;
            }

            const data = await response.json();

            if (data.success) {
                setToastMessage("Project deleted!");
                setPageMaster(<ProjectList key={Date.now()} />);
            }
        }

        return (
            <div>
            <div className="pagemaster_titolo">Project List</div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white cursor-pointer hover:bg-indigo-700;"
                >
                    Search...
                </button>

                <button className="btn-add" onClick={() => setPageMaster(<NewProject />)}>New Project</button>
            </div>

            {
                /*
                    The entire div is showed only if showFilters is setted to true
                */
            }
            {showFilters && (
                <div className="mt-4 w-full rounded-md border border-slate-200 overflow-x-auto">
                    <table className="search-table">
                        <tbody>
                            <tr>
                                <td>Search by name</td>
                                <td>Filter by status</td>
                                <td>Filter by Deadline</td>
                                <td>Filter by Budget</td>
                                <td>Choose Team Member</td>
                            </tr>
                            <tr>
                                <td data-label="Search by name">
                                  <input
                                      type="text"
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      placeholder="Search project..."
                                  />
                                </td>
                                <td data-label="Filter by status">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All statuses</option>
                                        <option value="active">Active</option>
                                        <option value="on-hold">On-hold</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
        
                                <td data-label="Filter by Deadline">
                                    <select
                                        value={deadlineFilter}
                                        onChange={(e) => setDeadlineFilter(e.target.value)}
                                    >
                                        <option value="">All deadlines</option>
                                        <option value="overdue">Overdue</option>
                                        <option value="today">Due today</option>
                                        <option value="next7">Next 7 days</option>
                                        <option value="next30">Next 30 days</option>
                                    </select>
                                </td>
        
                                <td data-label="Filter by Budget">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Min"
                                        value={budgetMin}
                                        onChange={(e) => setBudgetMin(e.target.value)}
                                    />
                                    <input
                                        className=" mt-1"
                                        type="number"
                                        min="0"
                                        placeholder="Max"
                                        value={budgetMax}
                                        onChange={(e) => setBudgetMax(e.target.value)}
                                    />
                                </td>
                                <td data-label="Choose Team Member">
                                    <select
                                        value={memberFilter}
                                        onChange={(e) => setMemberFilter(e.target.value)}
                                    >
                                    <option value="">All members</option>
                                    {sortedMembers.map((member) => (
                                        <option
                                        key={member.id_member}
                                        value={member.id_member}
                                        >
                                            {member.member_name} {member.member_surname}
                                        </option>
                                    ))}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-4 rounded-md border border-slate-300">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th className="cursor-pointer" onClick={() => handleSort("name")}>
                                Project
                                {sortConfig.key === "name" &&
                                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                            </th>
                            <th className="cursor-pointer min-w-[105px]" onClick={() => handleSort("status")}>
                                Status
                                {sortConfig.key === "status" &&
                                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                            </th>
                            <th className="cursor-pointer" onClick={() => handleSort("team_member")}>
                                Team Member
                                {sortConfig.key === "team_member" &&
                                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                            </th>
                            <th className="cursor-pointer min-w-[105px]" onClick={() => handleSort("ts_deadline")}>
                                Deadline
                                {sortConfig.key === "ts_deadline" &&
                                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                            </th>
                            <th className="cursor-pointer min-w-[150px]" onClick={() => handleSort("budget")}>
                                Budget
                                {sortConfig.key === "budget" &&
                                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                            </th>
                            <th>Details</th>
                            {/*
                            //The project timestamp. I think it’s unnecessary and could cause confusion with the deadline date.
                            <th className="cursor-pointer" onClick={() => handleSort("ts_creation")}>
                                Creation Date
                                {sortConfig.key === "ts_creation" &&
                                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                            </th>
                            */}
                            <th>Options</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/*{projects.map((project) => (*/}
                        {sortedProjects.map((project) => (
                            <SingleRowProject
                                key={project.id_project}
                                project={project}
                                members={members}
                                handleDeleteProject={handleDeleteProject}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        );
    }

    //Use a React component that can be reused inside some find functions.
    function SingleRowProject({project, members, handleDeleteProject}){
        const member_temp = members.find(
            member_temp => Number(member_temp.id_member) === Number(project.id_assigned_team_member)
        );
        return (
            <tr key={project.id_project}>
                <td data-label="Project">{project.name}</td>
                <td data-label="Status">{project.status}</td>
                <td data-label="Team member">
                    {member_temp
                        ? `${member_temp.member_name} ${member_temp.member_surname}`
                        : "Unassigned"}
                </td>
                <td data-label="Deadline">{formatTimestamp(project.ts_deadline)}</td>
                <td data-label="Budget">{formatBudget(project.budget)}</td>
                <td data-label="Details">{project.details}</td>
                {/*<td>{formatTimestamp(project.ts_creation)}</td>*/}
                <td>
                    <div className="table-options">
                    <button className="btn-edit" onClick={() => setPageMaster(
                        <EditProject
                            project={project}
                            members={members}
                        />)}
                    > Edit </button>

                    <button className="btn-delete"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this project?")) {
                                handleDeleteProject(project.id_project);
                            }
                        }}
                    > Delete </button>
                    </div>
                </td>
            </tr>
        )
    }

    function EditProject({project, members}) {
        const [id_member, setId_member] = useState(project.id_assigned_team_member);
        const [name, setName] = useState(project.name);
        const [status, setStatus] = useState(project.status);
        const [deadline, setDeadline] = useState(
            new Date(Number(project.ts_deadline) * 1000)
        );
        const [budget, setBudget] = useState(project.budget);
        const [details, setDetails] = useState(project.details);

        const [id_project, setId_project] = useState(project.id_project);

        const optionsMembers = (members || []).map(member => ({
          value: member.id_member,
          label: `${member.member_name} ${member.member_surname}`
        }));
        //console.log("optionsMembers:", optionsMembers);

        return(
            <div className="form_semplice">
                <div className="pagemaster_titolo">Edit Project</div>
                <form onSubmit={handleSubmitUpdateProject}>
                    <div className="mt-4 w-full rounded-md border border-slate-200 overflow-x-auto">
                    <table className="project-form-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Status</th>
                                <th>Team Member</th>
                                <th>Deadline</th>
                                <th>Budget</th>
                                <th>Details (optional)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="Project Name">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </td>
                                <td data-label="Status">
                                    <select 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)}
                                        placeholder="Status"
                                    >
                                        <option value="active">Active</option>
                                        <option value="on-hold">On hold</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                                <td data-label="Team Member">
                                    <Select
                                        value={
                                            optionsMembers.find(
                                                member => Number(member.value) === Number(id_member)
                                            ) || null
                                        }
                                        required
                                        options={optionsMembers}
                                        placeholder="search member..."
                                        isSearchable
                                        isClearable
                                        menuPortalTarget={document.body}
                                        onChange={(selected) => {
                                            setId_member(selected ? selected.value : null);
                                        }}
                                    />
                                </td>
                                <td data-label="Deadline">
                                    <DatePicker calssname="react-datepicker"
                                        required
                                        selected={deadline}
                                        onChange={(date) => setDeadline(date)}
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="Select a DeadLine"
                                    />
                                </td>
                                <td data-label="Budget">
                                    <input
                                        required
                                        type="number"
                                        placeholder="Budget"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                    />
                                </td>
                                <td data-label="Details">
                                    <textarea
                                      value={details}
                                      onChange={(e) => setDetails(e.target.value)}
                                      placeholder="Details (optional)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div><br />
                    <button type="submit" className="btn-edit">
                        Save project
                    </button>
                </form>
            </div>
        );

        async function handleSubmitUpdateProject(e) {
            e.preventDefault();
            const response = await fetch(
                "http://localhost:3000/api/edit_project"
                ,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_project: id_project,
                        name: name,
                        status: status,
                        deadline: deadline,
                        id_assigned_team_member: id_member,
                        budget: budget,
                        details: details
                    })
                }
            );


            if (response.status === 401) {setAuthenticated(false);return;}

            const data = await response.json();
            if (data.success){
                setToastMessage("Project saved!");
                setPageMaster(<ProjectList key={Date.now()} />)
            }
        }
    }

    function NewProject() {
        const [members, setMembers] = useState([]);
        const [id_member, setId_member] = useState("");
        const [name, setName] = useState("");
        const [status, setStatus] = useState("active");
        const [deadline, setDeadline] = useState("");
        const [budget, setBudget] = useState("");
        const [details, setDetails] = useState("");
        const [id_project, setId_project] = useState("0");

        useEffect(() => {
            async function loadMembersTemp() {
                const lista = await loadMembers();
                setMembers(lista);
            }
            loadMembersTemp();
        }, []);

        const optionsMembers = (members || []).map(member => ({
          value: member.id_member,
          label: `${member.member_name} ${member.member_surname}`
        }));
        //console.log("optionsMembers:", optionsMembers);

        return(
            <div className="form_semplice">
                <div className="pagemaster_titolo">New Project</div>
                <form onSubmit={handleSubmitNewProject}>
                <div className="mt-4 w-full rounded-md border border-slate-200 overflow-x-auto">
                    <table className="project-form-table">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Status</th>
                                <th>Team Member</th>
                                <th>Deadline</th>
                                <th>Budget</th>
                                <th>Details (optional)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="Project Name">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </td>
                                <td data-label="Status">
                                    <select 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)}
                                        placeholder="Status"
                                    >
                                        <option value="active">Active</option>
                                        <option value="on-hold">On hold</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </td>
                                <td data-label="Team Member">
                                    <Select
                                        required
                                        options={optionsMembers}
                                        placeholder="search member..."
                                        isSearchable
                                        isClearable
                                        menuPortalTarget={document.body}
                                        onChange={(selected) => {
                                            setId_member(selected ? selected.value : null);
                                        }}
                                    />
                                </td>
                                <td data-label="Deadline">
                                    <DatePicker calssname="react-datepicker"
                                        required
                                        selected={deadline}
                                        onChange={(date) => setDeadline(date)}
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="Select a DeadLine"
                                    />
                                </td>
                                <td data-label="Budget">
                                    <input
                                        required
                                        type="number"
                                        placeholder="Budget"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                    />
                                </td>
                                <td data-label="Details">
                                    <textarea
                                      value={details}
                                      onChange={(e) => setDetails(e.target.value)}
                                      placeholder="Details (optional)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                    <br /><button type="submit" className="btn-add">
                        Insert project
                    </button>
                </form>
            </div>
        );

        async function handleSubmitNewProject(e) {
            e.preventDefault();
            const response = await fetch(
                "http://localhost:3000/api/edit_project"
                ,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_project: id_project,
                        name: name,
                        status: status,
                        deadline: deadline,
                        id_assigned_team_member: id_member,
                        budget: budget,
                        details: details
                    })
                }
            );


            if (response.status === 401) {setAuthenticated(false);return;}

            const data = await response.json();
            if (data.success){
                setToastMessage("Project inserted!");
                setPageMaster(<ProjectList key={Date.now()} />)
            }
        }
    }
}
export default ManageProjects;