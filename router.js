var express = require('express');
var fs = require('fs');
var router = express.Router();

var siteOptions = require('./options');
var store = require('./store');
var brain =require("./network");


function writeData (clbk) {
    fs.readFile('./data/colors.json', function(err, data) {
        var colors = JSON.parse(data);
        var _store = store.getStore();
        // var newData = store.newData;
        _store.newData.map(function (item) {
            colors.push(item);
        });
        store.resetNewData();
        // colors.push({name: req.body.name, r:parseInt(req.body.r, 10), g: parseInt(req.body.g, 10), b: parseInt(req.body.b, 10)});

        fs.writeFile("./data/colors_" + Date.now() + ".json", data, function(err) {
            if(err) {
                console.log(err);
                clbk('error write!');
            } else {
                fs.writeFile("./data/colors.json", JSON.stringify(colors), function(err) {
                    if(err) {
                        console.log(err);
                        clbk('error write2!');
                    } else {
                        brain.training();
                        clbk( 
                            {
                                res: '200'
                            }
                        );
                    }
                });
            }
        });
    });

}

router.get('/', function (req, res){
    res.render('index');
});

router.get('/run', function (req, res){
    if (req.query.r && req.query.g && req.query.b) {
        var output = brain.net.run({r:req.query.r,g:req.query.g,b:req.query.b});
        var storeVals = store.getStore();
        res.json(
            {
                res: '200',
                networkLength: storeVals.networkLength,
                output: output
            }
        );
    } else {
        res.send('error');
    }
});

router.post('/add', function (req, res){
    if (req.body.r && req.body.g && req.body.b && req.body.name) {
        store.addData({r: parseInt(req.body.r, 10), g: parseInt(req.body.g, 10), b: parseInt(req.body.b, 10), name: req.body.name});
        // var outputData = {};
        // outputData[req.body.name] = 1;
        // var src = {
        //     input: {r: parseInt(req.body.r, 10) / 255, g: parseInt(req.body.g, 10) / 255, b: parseInt(req.body.b, 10) / 255},
        //     output: outputData
        // }
        // console.log(src);
        // brain.net.train([src]);
        // var storeData = store.getStore();
        // if (storeData.newData.length < 160) {
        //     res.json(
        //         {
        //             res: '200',
        //             networkLength: store.updNetwLength()
        //         }
        //     );
        // } else {
        //     writeData (function (save) {
        //         if (typeof save == 'object') {
                    res.json(
                        {
                            res: '200',
                            networkLength: store.networkLength
                        }
                    );
        //         } else {
        //             res.send(save);
        //         }
        //     });
        // }

    } else {
        res.send('error add!');
    }
});

router.post('/save', function (req, res){
    writeData (function (save) {
        if (typeof save == 'object') {
            res.json(save);
        } else {
            res.send(save);
        }
    });
});

module.exports = router;
