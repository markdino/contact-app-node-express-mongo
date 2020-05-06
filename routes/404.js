const router = require("express").Router();

router.get("*", (req, res) => {
  res.status(404).render("error", {
    Error: { code: 404, status: "Not Found", message: "Page Not Found!" }
  });
});

module.exports = router;
