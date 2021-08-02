const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const {Chart, RadarController, RadialLinearScale, PointElement, LineElement } = require('chart.js');
const local = require('./localMessage.js');

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement);

const data = {
  labels: ['Science', 'Biology', 'Radd', 'D2f'],
  datasets: [
    {
      label: 'D0',
      data: [
        20,
        20,
        20,
        20
    ],
      borderColor: 'rgb(255, 99, 132)',
    },
  ]
};

const config = {
  type: 'radar',
  data: data,
  options: {
    plugins: {
      filler: {
        propagate: false
      },
      'samples-filler-analyser': {
        target: 'chart-analyser'
      }
    },
    interaction: {
      intersect: false
    }
  }
};

const hexToRgb = function(hex, opacity = 1) {
  if (hex.indexOf('#') > -1) {
    hex = hex.substr(hex.indexOf('#') + 1);
  }

  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const getLabels = function(vizData) {
  return vizData.fields.metricID.map(metric => metric.name);
};

const getDataSets = function(vizData) {
  const datasets = [];
  let seriesId = 0;
  vizData.tables.DEFAULT.map(row => {
    const dataset = {
      label : row.dimID && row.dimID.length ? row.dimID[0] : '',
      data : row.metricID,
      borderColor : vizData.theme.themeSeriesColor[seriesId].color,
      backgroundColor : hexToRgb(vizData.theme.themeSeriesColor[seriesId].color, 0.7)
    };
    datasets.push(dataset);
    seriesId++;
  });
  return datasets;
}

// write viz code here
const drawViz = (data) => {
  // viz.readmeViz();
  // viz.firstViz(data);
  //console.log(getLabels(data))

  config.data = {
    labels : getLabels(data),
    datasets: getDataSets(data)
  };

  var margin = { top: 10, bottom: 10, right: 10, left: 10 };

  var height = dscc.getHeight() - margin.top - margin.bottom;
  var width = dscc.getWidth() - margin.left - margin.right;
  
  var canvasElement = document.createElement('canvas');
  var ctx = canvasElement.getContext('2d');
  canvasElement.id = 'myViz';
  canvasElement.height = height;
  canvasElement.width = width;
  document.body.appendChild(canvasElement);

  var myRadarChart = new Chart(ctx, config);
};

// renders locally
if (DSCC_IS_LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
