const { application } = require("express");
const { findAllEvents, findEvent, isRegisteredforEvent, createTeam, joinTeam, findAllSportsEvents, findAllEsports, findAllEsportsEvents } = require("../utils.js");
const { findAllColleges, isAdmin } = require("../readFromSheet.js");
const { authCheck, liveCheck } = require("../middleware/auth");
const router = require("express").Router();

router.get("/", async (req, res) => {
    let events = await findAllSportsEvents();

    let context = {
        events: events,
        authenticated: req.isAuthenticated(),
        admin: await isAdmin(req)
    }

    res.render("events.ejs", context);
})

router.get("/esports", async (req, res) => {
    let events = await findAllEsportsEvents();

    let context = {
        events: events,
        authenticated: req.isAuthenticated(),
        admin: await isAdmin(req)
    }

    res.render("esports.ejs", context);
})

router.get("/game", async (req, res) => {
    const gameName = req.query.game;
    const event = await findEvent(gameName);
    if (event == null)
        res.send("No such game found");

    // const checker = isRegisteredforEvent(req.user, event);
    // console.log(checker);

    const context = {
        event: event,
        // isRegisteredforEvent: checker ? checker.toString() : "false",
        authenticated: req.isAuthenticated(),
        admin: await isAdmin(req)
    };

    res.render("game", { ...context, user: req.session.user });

})


router.get("/createTeam", [authCheck, liveCheck], async (req, res) => {
    const gameName = req.query.game;
    const event = await findEvent(gameName);

    const context = {
        event: event,
        user: req.session.user,
        authenticated: req.isAuthenticated(),
        colleges: await findAllColleges(),
        admin: await isAdmin(req)
    }
    res.render('createteam.ejs', context)
})

router.post("/createTeam", [authCheck, liveCheck], async (req, res) => {
    const gameName = req.query.game;
    const event = await findEvent(gameName);

    // validation need to  be added here
    let val = await createTeam(req, event);
    req.flash("message", val);

    res.redirect("/profile");
})

router.get("/joinTeam", authCheck, async (req, res) => {
    const context = {
        authenticated: req.isAuthenticated(),
        colleges: await findAllColleges(),
        admin: await isAdmin(req)
    }
    res.render('confirm', context);
})




router.post("/joinTeam", [authCheck, liveCheck], async (req, res) => {
    const { teamId, college, phone } = req.body;
    let checker = await joinTeam(teamId, req);

    req.flash("message", checker);
    res.redirect("/profile");
})

module.exports = router;