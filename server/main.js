const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const _ = require('lodash');
const cors = require('cors');

const config = require('./config.json');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {

    axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${config.instakey}`)
        .then(function (response) {
            console.log("IG DONE");
            googleVision(response.data.data, res);
        })
        .catch(function (error) {
            console.log(error);
        });
});

function googleVision(response, res) {
    var result = [];
    const images = response.map((obj) => obj.images["standard_resolution"].url);

    const categories = ['beach', 'sea', 'mountain', 'road', 'fashion', 'food', 'sunset', 'music', 'motorcycle'];

    const length = images.length;

    images.forEach(element => {
        axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${config.gvkey}`, {

            "requests": [
                {
                    "image": {
                        "source": {
                            "imageUri": element
                        }
                    },
                    "features": [
                        {
                            "type": "LABEL_DETECTION"
                        }
                    ]
                }
            ]
        }
        ).then((response) => {
            console.log("GV DONE");

            response = response.data.responses[0].labelAnnotations;
            response.forEach(eachCategory => {
                categories.forEach(category => {
                    if (category === eachCategory.description) {
                        if (eachCategory.score > 0.75) {
                            var resObj = {
                                category,
                                "imageUri": element
                            }
                        }
                        else {
                            var resObj = {
                                "category": "others",
                                "imageUri": element
                            }
                        }
                        result.push(resObj);
                    }
                })
            });
        });
    });
    setTimeout(() => {
        console.log("I HIT");
        const grouped = _.mapValues(_.groupBy(result, 'category'),
            clist => clist.map(category => _.omit(category, 'category')));
        res.send(grouped);
    }, 10000);
}

app.listen(3000, () => {
    console.log('Started server');
});

module.exports = { app };