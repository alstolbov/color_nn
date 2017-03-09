var fs = require('fs');var brain =require("brain");
var net = new brain.NeuralNetwork();

var store = require('./store');

var NORMALDATA = [];
var normalize = function (color) {
    return { r: color.r / 255, g: color.g / 255, b: color.b / 255 };
};

var training = function () {

  console.log('Training...');
  fs.readFile('./data/colors.json', function(error, data) {
    var colors = JSON.parse(data);
    colors.map(function (colorData) {
      var outputData = {};
      outputData[colorData.name] = 1;
      NORMALDATA.push({
        input: normalize({r: colorData.r, g: colorData.g, b: colorData.b}),
        // input: {r: colorData.r, g: colorData.g, b: colorData.b},
        output: outputData
      });
    });

    net.train(NORMALDATA);
    store.setNetwLength(colors.length);
    console.log('READY!');
  });
}

module.exports = {
  training: training,
  net: net
};
