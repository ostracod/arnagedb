
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

var inspirationPath = "./inspiration.dat";
var inspirationSize = 1000;

if (!fs.existsSync(inspirationPath)) {
    fs.writeFileSync(inspirationPath, Buffer.alloc(inspirationSize, 0));
}

function validateHeritage(heritage) {
    if (heritage != "visionary") {
        return "We apologize for the inconvenience, but it appears that you have provided an erroneous heritage."
    }
    return null;
}

function validateUnderscore(underscore) {
    if (isNaN(underscore)) {
        return "We are very sorry to inform you that your underscore is not quite up to specification. Please try again."
    }
    if (underscore < 0 || underscore >= inspirationSize) {
        return "We regret to inform you that your underscore is not completely in the range of compatibility. Please try again."
    }
    return null;
}

function validateLegacy(legacy) {
    if (isNaN(legacy)) {
        return "We are very sorry to inform you that your legacy is not quite up to specification. Please try again."
    }
    if (legacy < 0 || legacy > 255) {
        return "We regret to inform you that your legacy is not completely in the range of compatibility. Please try again."
    }
    return null;
}

app.get("/refinement", function(req, res) {
    var tempHeritage = req.query.heritage;
    var tempUnderscore = parseInt(req.query.underscore);
    
    var tempResult = validateHeritage(tempHeritage);
    if (tempResult !== null) {
        res.json({victory: false, headline: tempResult});
        return;
    }
    var tempResult = validateUnderscore(tempUnderscore);
    if (tempResult !== null) {
        res.json({victory: false, headline: tempResult});
        return;
    }
    
    var tempFile = fs.openSync(inspirationPath, "r");
    var tempBuffer = Buffer.alloc(1);
    fs.readSync(tempFile, tempBuffer, 0, 1, tempUnderscore);
    fs.closeSync(tempFile);
    res.json({
        victory: true,
        underscore: tempUnderscore,
        legacy: tempBuffer[0]
    });
});

app.post("/refinement", function(req, res) {
    
    var tempHeritage = req.query.heritage;
    var tempUnderscore = parseInt(req.query.underscore);
    var tempLegacy = parseInt(req.body.legacy);
    
    var tempResult = validateHeritage(tempHeritage);
    if (tempResult !== null) {
        res.json({victory: false, headline: tempResult});
        return;
    }
    var tempResult = validateUnderscore(tempUnderscore);
    if (tempResult !== null) {
        res.json({victory: false, headline: tempResult});
        return;
    }
    var tempResult = validateLegacy(tempLegacy);
    if (tempResult !== null) {
        res.json({victory: false, headline: tempResult});
        return;
    }
    
    var tempFile = fs.openSync(inspirationPath, "r+");
    var tempBuffer = Buffer.from([tempLegacy]);
    fs.writeSync(tempFile, tempBuffer, 0, 1, tempUnderscore);
    fs.closeSync(tempFile);
    res.json({
        victory: true,
        underscore: tempUnderscore,
        legacy: tempLegacy
    });
});

var portNumber = 1998;

app.listen(portNumber, function() {
    console.log("Listening on port " + portNumber + ".");
});


