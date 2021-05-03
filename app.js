const express = require("express");
const request = require("request");
const client = require("@mailchimp/mailchimp_marketing");




const app = express();

const herokuApiKey = process.env.APIKEY;

client.setConfig({
    apiKey: herokuApiKey,
    server: "us1",
});

/* Anstelle von Body Parser wird der interne Parser genutzt */
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


/* Directory als öffentlich kennzeichnen für CSS und Bilder */
app.use(express.static("public"));


/* Standard Listener für den Server und Port 
Process.env.PORT wird für Heroku hosting verwendet
*/
app.listen(process.env.PORT || 3000, function () {

    console.log("Ready");
})


/* Haupt GET Aufruf für die Homeseite */
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})


/* Übermittlung von Formularen via POST. 
Zusätzlich muss auf der Form eine METHOD und eine ACTION gekennzeichnet sein */
app.post("/", function (req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;


    const run = async () => {
        const response = await client.lists.addListMember("cccd28e784", {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }, update_existing: true
        });

        console.log("gesendet");

        console.log(response.id);
    };
    res.sendFile(__dirname + "/success.html")


    run().catch(e => res.sendFile(__dirname + "/failure.html"));
})

