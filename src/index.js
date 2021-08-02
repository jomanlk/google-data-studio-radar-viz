const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
// Chart.register(ChartDataLabels);

// export const LOCAL = false;
// export const DSCC_IS_LOCAL = false;

const data = {
    labels: ['Science', 'Biology', 'Radd', 'D2f'],
    datasets: [
        {
            label: 'D0',
            data: [20, 20, 20, 20],
            borderColor: 'rgb(255, 99, 132)',
        },
    ],
};

const quadrantPlugin = {
    id: 'draw_quadrants',
    beforeDraw: (chart) => {
        const canvas = chart.canvas;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(-15, -15);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();

        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(canvas.width + 10, 15);
        ctx.lineTo(0, canvas.height);
        ctx.stroke();

        ctx.restore();
    },
};

Chart.defaults.set('plugins.datalabels', {
    opacity: 1,
    textAlign: 'left',
    color: 'white',
    borderColor: '#11469e',
    borderWidth: 2,
    borderRadius: 100,
    font: {
        weight: 'bold',
        size: 12,
        lineHeight: 1 /* align v center */,
    },
    padding: {
        top: 5,
    },
    /* hover styling */
    backgroundColor: function (context) {
        return context.hovered ? context.dataset.borderColor : 'white';
    },
    color: function (context) {
        return context.hovered ? 'white' : context.dataset.borderColor;
    },
    listeners: {
        enter: function (context) {
            context.hovered = true;
            return true;
        },
        leave: function (context) {
            context.hovered = false;
            return true;
        },
    },
});

const config = {
    type: 'radar',
    data: data,
    //plugins: [quadrantPlugin, ChartDataLabels],
    plugins: [quadrantPlugin],
    options: {
        scales: {
            r: {
                display: true,
                angleLines: {
                    color: '#000000',
                },
                grid: {
                    display: true,
                },
                pointLabels: {
                    color: '#000000',
                },
                ticks: {
                    display: true,
                },
            },
        },

        plugins: {
            legend: {
                display: false,
            },
            filler: {
                propagate: false,
            },
            'samples-filler-analyser': {
                target: 'chart-analyser',
            },
            tooltip: {
                enabled: true,
            },
        },
        interaction: {
            intersect: false,
        },
    },
};

const hexToRgb = function (hex, opacity = 0.2) {
    if (hex.indexOf('#') > -1) {
        hex = hex.substr(hex.indexOf('#') + 1);
    }

    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getLabels = function (vizData) {
    return vizData.fields.metricID.map((metric) => metric.name);
};

const getDataSets = function (vizData) {
    const datasets = [];
    let seriesId = 0;
    vizData.tables.DEFAULT.map((row) => {
        const dataset = {
            label: row.dimID && row.dimID.length ? row.dimID[0] : '',
            data: row.metricID,
            fill: true,
            borderColor: vizData.theme.themeSeriesColor[seriesId].color,
            backgroundColor: hexToRgb(
                vizData.theme.themeSeriesColor[seriesId].color
            ),
        };
        datasets.push(dataset);
        seriesId++;
    });
    return datasets;
};

// write viz code here
const drawViz = (data) => {
    // viz.readmeViz();
    // viz.firstViz(data);

    config.data = {
        labels: getLabels(data),
        datasets: getDataSets(data),
    };

    var margin = { top: 30, bottom: 30, right: 30, left: 30 };

    var height = dscc.getHeight() - margin.top - margin.bottom;
    var width = dscc.getWidth() - margin.left - margin.right;

    var canvasElement = document.createElement('canvas');
    var ctx = canvasElement.getContext('2d');
    canvasElement.id = 'myViz';
    canvasElement.height = height;
    canvasElement.width = width;

    const chartElem = document.getElementById('myViz');
    if (chartElem) {
        chartElem.remove();
    }
    document.body.appendChild(canvasElement);

    var myRadarChart = new Chart(ctx, config);
};

// renders locally
if (DSCC_IS_LOCAL) {
    drawViz(local.message);
} else {
    dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
