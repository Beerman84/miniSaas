import { useEffect, useState } from "react";
import ManageTeamMembers from "./ManageTeamMembers.jsx";
import ManageProjects from "./ManageProjects.jsx";

function Dashboard({ setAuthenticated }) {
    /*
        setAuthenticated should always be called. This way, for every future request to Node.js, it checks whether we are still connected or whether the session has expired.
        pagemaster is just the main container.
        toast_message is the popup message displayed when we reload pages after an insert, edit, or delete action.
        menulaterale is still under development. It is intended to support additional submenus in the future.
    */
    const [pageMaster, setPageMaster] = useState(null);     
    const [toast_message, setToastMessage] = useState("");
    const [menuLaterale, setMenuLaterale] = useState(null); 

    useEffect(() => {
        if (!toast_message) return;
        const timer = setTimeout(() => {
            setToastMessage("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast_message]);

    function open_page(page) {
        switch (page){
            case "members":{
                setPageMaster(
                    <ManageTeamMembers
                    setAuthenticated={setAuthenticated}
                    setPageMaster={setPageMaster}
                    setMenuLaterale={setMenuLaterale}
                    setToastMessage={setToastMessage}
                    />
                );
                break;
            }
            case "projects":{
                setPageMaster(
                    <ManageProjects
                    setAuthenticated={setAuthenticated}
                    setPageMaster={setPageMaster}
                    setMenuLaterale={setMenuLaterale}
                    setToastMessage={setToastMessage}
                    />
                );
                break;
            }
            default:{
                setMenuLaterale(null);
                setPageMaster(null);
                break;
            }
        }
    }
    return (
    <div className="p-4">
        <header>
            <div className="flex gap-4">
                <button className="navHeaderButtonsClass" onClick={() => open_page("projects")}>Projects</button> 
                <button className="navHeaderButtonsClass" onClick={() => open_page("members")}>Members</button> 
            </div >
            <nav className="sub-menu">
                {menuLaterale}
            </nav>
        </header>
        <main className="main-content">
            {toast_message && (
            <div className="toast-message">
                    {toast_message}
                </div>
            )}
            <div className="pagemaster">
                {pageMaster}
            </div>
        </main>
    </div>
    );
}

export default Dashboard;