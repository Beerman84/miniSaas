import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
function App() {
    /*
        This is just to check whether we are logged in and to receive our ID_USER.
        If authenticated is null, we display a message asking the user to check the Node.js connection.
        If the user is not authenticated, we redirect them to the login page.
        Otherwise, we redirect them to the dashboard.
    */
    const [authenticated, setAuthenticated] = useState(null);
    useEffect(() => { 
        fetch(
            "http://localhost:3000/api/check_logged",
            {credentials: "include"}
        )
        .then(response => {
            return response.json();
        })  
        .then(data => {
            setAuthenticated(data.authenticated);
        });
    }, []);

    if (authenticated === null) {
        return <div>Loading (meanwhile, check your node.js connection)</div>;
    }
    if (!authenticated) {return <Login />;}

    return <Dashboard setAuthenticated={setAuthenticated} />;
}


export default App;