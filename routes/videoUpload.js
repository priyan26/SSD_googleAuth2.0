const express = require('express')
const router = express.Router()
const multer = require('multer')
const {google} = require("googleapis");
const fs = require('fs')
const {ensureAuth} = require('../middleware/auth')
const config = require('../credentials.json')
let dir = "./videos"

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
}

let Storage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, "./videos");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

let upload = multer({
    storage: Storage,
}).single("file"); //Field name and max count


router.get('/upload', (req, res) => {
    res.render('videoUpload')
})

//YouTube video upload
router.post("/upload/youtube", ensureAuth, (req, res) => {
    try {
        //get tokens to details to object
        const tokens = JSON.parse(fs.readFileSync('../tokens.json', 'utf8'));
        //make OAuth2 object
        const oAuth2Client = new google.auth.OAuth2(config.web.client_id,
            config.web.client_secret,
            config.web.redirect_uris)
        // set token details to OAuth2 object
        oAuth2Client.setCredentials(tokens)
        //create YouTube object to call APIs
        const youtube = google.youtube({version: "v3", auth: oAuth2Client});
        upload(req, res, function (err) {
            let title;
            let description;
            if (err) {
                console.log(err);
            } else {
                title = req.body.title;
                description = req.body.description;
                youtube.videos.insert(
                    {
                        resource: {
                            // Video title and description
                            snippet: {
                                title: title,
                                description: description,
                            },
                            // I don't want to spam my subscribers
                            status: {
                                privacyStatus: "private",
                            },
                        },
                        // This is for the callback function
                        part: "snippet,status",

                        // Create the readable stream to upload the video
                        media: {
                            body: fs.createReadStream(req.file.path)
                        },
                    },
                    (err, data) => {
                        if (err) throw err
                        fs.unlinkSync(req.file.path);
                        res.render('videoUpload', {success: true})
                    });

            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

});


module.exports = router