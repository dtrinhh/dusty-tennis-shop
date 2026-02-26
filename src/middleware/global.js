// Convenience variable for UI state based on session state
res.locals.isLoggedIn = false;
if (req.session && req.session.user) {
    res.locals.isLoggedIn = true;
}