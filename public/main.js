var utils = {
  randomColor : function() {
    return { r: Math.round(Math.random() * 255),
             g: Math.round(Math.random() * 255),
             b: Math.round(Math.random() * 255) };
  },

  toRgb : function(color) {
    return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
  },

  normalize : function(color) {
    return { r: color.r / 255, g: color.g / 255, b: color.b / 255 };
  },
  dict: {
    red: 'Красный',
    orange: 'Оранжевый',
    yellow: 'Желтый',
    green: 'Зеленый',
    cyan: 'Голубой',
    blue: 'Синий',
    purple: 'Фиолетовый',
    black: 'Черный',
    gray: 'Серый',
    white: 'Белый',
    pink: 'Розовый',
    brown: 'Коричневый'
  }
};


var rgbColors = [];

var mainNode = document.getElementById('main');
var btn = document.getElementById('push');
var targetNode = document.getElementById('res');
var showRgbColorsNode = document.getElementById('rgbColors');
var saveIt = document.getElementById('saveIt');
var selectNode = document.getElementById('colors');
var copy = document.getElementById('copy');
var colorLinksNode = document.getElementById('colorLinks');
var numLengthNode = document.getElementById('numLength');
var loaderNode = document.getElementById('loader');

var color;

// var clipboard = new Clipboard('.copy', {
//     target: function() {
//         return document.querySelector('#rgbColors');
//     }
// });
// clipboard.on('success', function(e) {
//     alert('Data copy success!');
// });

function test () {
  loaderNode.style.display = "block";
  mainNode.style.display = "none";
  var resTraining = {res:0, data: {}};
  color = utils.randomColor();
  var rgbColor = utils.toRgb(color);
  $.get('/run', utils.normalize(color), function (resData) {
    if(typeof resData !== 'object') {
      alert('Error');
    } else {
      var output = resData.output;
      var HTML = '<br><br><div style="width: 60px; height: 60px; background:' + rgbColor + ';"></div>';
      var HTML_res = ''
      HTML += '<p>' + rgbColor + '</p>';
      Object.keys(output).map(function (key) {
        if (output[key] > 0.1) {
          HTML_res += '<div style="padding-left: 15px;">' + (key in utils.dict ? utils.dict[key] : key) + ' - ' + output[key] + '</div>';
        }
        if (output[key] > resTraining.res) {
          resTraining.res = output[key];
          resTraining.data = color;
          resTraining.data.name = key;
        }
      });
      targetNode.innerHTML = HTML + '<div>Результат детектора: ' +
        (resTraining.data.name in utils.dict ? utils.dict[resTraining.data.name] : resTraining.data.name) +
        ' (' + resTraining.res + ')</div><br>Все найденные значения:<br>' + HTML_res;
      numLengthNode.innerHTML = resData.networkLength;
      selectNode.innerHTML = buildSelect();
      colorLinksNode.innerHTML = colorLinks(resTraining.data.name);
      // showRgbColorsNode.innerHTML = showData ();
      if (resTraining.res > 0) {
        selectNode.value = resTraining.data.name;
      }
      loaderNode.style.display = "none";
      mainNode.style.display = "block";
    }
  });
};

var buildSelect = function () {
  var HTML = '';
  Object.keys(utils.dict).map(function (colorKey) {
    HTML += '<option value="' + colorKey + '">' + utils.dict[colorKey] + '</option>';
  });

  return HTML;
};

function showData () {
  var HTML = '//' + rgbColors.length +' in:<br>var customColors = [<br>';
  rgbColors.map(function (colorData) {
    HTML += '{name:"' + colorData.name + '",r:' + colorData.r + ',g:' + colorData.g + ',b:' + colorData.b + '},<br>';
  });
  HTML += '];';

  return HTML;
};

// function addToRgbColors() {
//   // var newData = utils.normalize(color);
//   var newData = color;
//   newData.name = selectNode.value;
//   $.post('/add', newData, function (data) {
//     if(typeof data !== 'object') {
//       alert(data);
//     } else {
//       numLengthNode.innerHTML = data.networkLength;
//       btn.click();
//     }
//   });

  
// }

function colorLinks (resTrainingName) {
  var HTML = '';
  var text;
  Object.keys(utils.dict).map(function (colorKey) {
    HTML += '<div style="cursor:pointer; text-decoration: underline; padding: 4px 10px; ' + (colorKey == resTrainingName ? "background: #ddd;" : "" ) + ' display: inline-block;"' +
      ' onclick="addColorToArray(' + "'" + colorKey + "');" + '">' + utils.dict[colorKey] + '</div>';
  });

  return HTML;
}

function addColorToArray (colorName) {
  // selectNode.value = color;
  // saveIt.click();
  var newData = color;
  newData.name = colorName;
  $.post('/add', newData, function (data) {
    if(typeof data !== 'object') {
      alert(data);
    } else {
      numLengthNode.innerHTML = data.networkLength;
      btn.click();
    }
  });
}

function backuper () {
  $.post('/save', function (data) {
    if(typeof data !== 'object') {
      alert(data);
    } else {
      alert("Дождитесь окончания переобучения");
      btn.click();
    }
  });
}

btn.onclick = test;
copy.onclick = backuper;
// saveIt.onclick = addToRgbColors;
test ();