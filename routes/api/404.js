const router = require("express").Router();
const { payload } = require("../../models/contact");

router.get("*", (req, res) => {
  res
    .status(404)
    .send(payload("API Routes Not Found.", null, "Not Found!"));
});

module.exports = router;
