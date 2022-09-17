const { userDetails, findTeamById, findUserTeams } = require("../utils")
const { authCheck, liveCheck } = require("../middleware/auth");
const router = require("express").Router();

router.get("/profile", [authCheck, liveCheck], async (req, res) => {

    const userDetail = await userDetails(req.user);
    const userTeams = await findUserTeams(req.user);

    context = {
        user: userDetail,
        teams: userTeams,
        authenticated: req.isAuthenticated()
    }
    // users team
    res.render("profile", context);
})

router.get("/ourteam", async (req, res) => {
    res.render('ourteam.ejs');
})

module.exports = router