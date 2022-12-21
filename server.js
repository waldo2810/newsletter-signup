//REQUIRE MODULES.
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
  apiKey: "cecbf33da0dca7d9fe8ed285f558ccf9-us21",
  server: "us21",
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  //GET FIELDS FROM FORM
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

  //MAILCHIMP API
  const listId = "43f6f3d066";

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  }

  run()
    .then(() => {
      res.sendFile(__dirname + "/success.html");
    })
    .catch(() => {
      res.sendFile(__dirname + "/failed.html");
    });
});

//REDIRECT WHEN "GO BACK" IS PRESSED.
app.post("/failed", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running on port 3000");
});
