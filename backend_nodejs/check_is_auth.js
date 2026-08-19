/*
    This function is called inside the controllers for every function.
    It simply checks whether the user is authenticated.
    If not, it returns a 401 status, which is handled by every asynchronous function in React.
    If the response is 401, the user is redirected to the login page.
*/
function check_is_auth(req, res) {
    console.log("Session expires:", req.session?.cookie?.expires);
    console.log("Session maxAge:", req.session?.cookie?.maxAge);
    if (req.session && req.session.id_user) {
        return true;
    }

    res.status(401).json({
        authenticated: false,
        message: "Not authenticated"
    });

    return false;
}

module.exports = {
    check_is_auth
};