const router = require("express").Router();
const protectedApi = require('../../middleware/protectedApi');
const Contact = require("../../models/contact");
const { search, payload, filter } = Contact;

// My contacts
router.get("/", protectedApi, (req, res) => {
  Contact.find({ owner: req.user._id })
    .sort({ name: 1 })
    .select("name avatar")
    .then(result => res.send(payload(null, result, 'My contacts')))
    .catch(err => {
      res.status(400).render(payload(err.message, null, err.name));
    });
});

// Private contacts
router.get("/private", protectedApi, (req, res) => {
  Contact.find({ owner: req.user._id, private: true })
    .sort({ name: 1 })
    .select("name avatar")
    .then(result => {
      res.send(payload(null, result, 'private'));
    })
    .catch(err => {
      res.status(400).render(payload(err.message, null, err.name));
    });
});

// Contact details View
router.get("/:id", (req, res) => {
  Contact.findById(req.params.id)
    .then(result => {
      if (result.private) {
        if (!req.user)
          return res.status(401).send(payload('Unauthorized user.', null, 'Unauthorized'));

        if (result.owner.toString() !== req.user._id.toString())
          return res
            .status(403)
            .send(payload("Access denied.", null, "Forbidden"));
      }
      res.send(payload(null, result, 'Contact'));
    })
    .catch(err => {
      if (!err.value)
        return res
          .status(404)
          .send(
            payload("Contact not found or invalid id.", null, "Not Found")
          );
      res
        .status(400)
        .send(payload(
          `${err.name}. "${err.value}" is invalid.`,
          null,
          "Bad request",
        ));
    });
});

// Save Contact
router.post("/", protectedApi, (req, res) => {
  const validateInput = () => {
    let hasError = false
    const errors = {}
    if (!req.body.name) {
      errors.name = '"Name" is required'
      hasError = true
    }

    if (req.body.email) {
      if (!(req.body.email.includes('@') && req.body.email.includes('.')))
        errors.email = 'Invalid email'
      hasError = true
    }

    if (hasError)
      return res.status(400).send(payload(errors, null, 'Input error'));
  }
  validateInput();

  req.body.owner = req.user._id;
  let contactName = req.body.name;
  req.body.name = contactName.replace(contactName[0], contactName[0].toUpperCase());

  if (req.body.private)
    req.body.private = (req.body.private === "on" || req.body.private === true);

  const newContact = filter(
    req.body,
    'avatar name mobile tel email address owner private'
  );

  Contact.create(newContact)
    .then(response => res.send(payload(null, response, 'New contact added')))
    .catch(err => {
      res.status(400).send(payload(err.message, null, err.name));
    });
});

// Delete Contact
router.delete("/:id", protectedApi, async (req, res) => {
  const result = await Contact.findById(req.params.id);
  if (!result)
    return res
      .status(404)
      .send(
        payload("Contact already been deleted.", null, "Not Found")
      );

  if (result.owner.toString() !== req.user._id.toString())
    return res
      .status(403)
      .send(payload("Access denied.", null, "Forbidden"));

  Contact.deleteOne({ _id: req.params.id })
    .then(() => res.send(payload(null, result, 'Deleted')))
    .catch(err => {
      res
        .status(400)
        .send(
          payload(
            `${err.name}. "${err.value}" is invalid.`,
            null,
            "Bad request"
          )
        );
    });
});


// Update Contact
router.put("/:id", protectedApi, async (req, res) => {
  const result = await Contact.findById(req.params.id);
  if (!result)
    return res
      .status(404)
      .send(
        payload("Contact doesn't exist anymore.", null, "Not Found")
      );
  if (result.owner.toString() !== req.user._id.toString())
    return res
      .status(403)
      .send(payload("Access denied.", null, "Forbidden"));

  if (req.body.private)
    req.body.private = (req.body.private === "on" || req.body.private === true);

  if (req.body.name) {
    let contactName = req.body.name;
    req.body.name = contactName.replace(contactName[0], contactName[0].toUpperCase());
  }

  if (req.body.email) {
    if (!(req.body.email.includes('@') && req.body.email.includes('.'))) {
      return res.status(400).send(payload('Invalid email', null, 'Bad request'))
    }
  }

  const newContact = filter(
    req.body,
    'avatar name mobile tel email address private'
  );

  result.updateOne({ $set: newContact })
    .then(response => res.send(payload(null, response, 'Update success')))
    .catch(err => {
      res
        .status(400)
        .send(
          payload(
            `${err.name}. "${err.value}" is invalid.`,
            null,
            "Bad request"
          )
        );
    });
});

// Search Contact
router.post("/search", protectedApi, (req, res) => {
  const query = req.query.name
  if (!query)
    return res.status(400).send(payload("No query", null, "Bad request"));

  Contact.find({ owner: req.user._id })
    .select("name avatar")
    .then(result => {
      payload(null, search(result, query), 'Search my contact');
    })
    .catch(err => {
      res.status(400).send(payload(err.message, null, err.name));
    });
});

router.post("/private/search", protectedApi, (req, res) => {
  const query = req.query.name
  if (!query)
    return res.status(400).send(payload("No query", null, "Bad request"));

  Contact.find({ owner: req.user._id, private: true })
    .select("name avatar")
    .then(result => {
      payload(null, search(result, query), 'Search private contact');
    })
    .catch(err => {
      res.status(400).send(payload(err.message, null, err.name));
    });
});

module.exports = router;
