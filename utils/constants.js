require('dotenv').config();

const Constants = {
    HTML_OPTIONS: {
        method: "GET",
        headers: {
            "Authorization" : "Bearer " + process.env.CANVAS_API_KEY
        },
    },
}

module.exports = Constants;