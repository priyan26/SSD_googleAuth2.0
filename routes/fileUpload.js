const express = require('express')
const multer = require('multer')
const fs = require('fs')
const {google} = require("googleapis");
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const config = require('../credentials.json')


let dir = "./files"
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
}


let Storage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, "./files");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

let upload = multer({
    storage: Storage,
}).single("file");

router.get('/upload', (req, res) => {
    res.render('fileUpload')
})

//Google Drive Upload
router.post("/upload/drive", ensureAuth, (req, res) => {

    try {
        //get tokens to details to object
        const tokens = JSON.parse(fs.readFileSync('../tokens.json', 'utf8'));
        //make OAuth2 object
        const oAuth2Client = new google.auth.OAuth2(config.web.client_id,
            config.web.client_secret,
            config.web.redirect_uris)
        // set token details to OAuth2 object
        oAuth2Client.setCredentials(tokens)
        //create drive object to call APIs
        const drive = google.drive({version: "v3", auth: oAuth2Client});
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(req.file.filename);
                const fileMetadata = {
                    name: req.file.filename,
                };
                const media = {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(req.file.path),
                };
                drive.files.create(
                    {
                        resource: fileMetadata,
                        media: media,
                        fields: "id",
                    },
                    (err, file) => {
                        if (err) {
                            // Handle error
                            console.error(err);
                        } else {
                            fs.unlinkSync(req.file.path)
                            res.render('fileUpload', {success: true})
                        }

                    }
                );
            }
        });


    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

});


module.exports = router