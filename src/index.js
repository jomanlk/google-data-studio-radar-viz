const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
import { Chart, registerables } from 'chart.js';
import { quadrantPlugin, myLegendPlugin } from './plugins';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    trimOrPad,
    generatePointLabels,
    generateStyles,
    hexToRgb,
    getLabels,
    getDataSets,
    getChartContainer,
} from './helpers';

Chart.register(...registerables);
// Chart.register(ChartDataLabels);

const MAX_POINT_LABEL_LEN = 12;

// export const LOCAL = false;
// export const DSCC_IS_LOCAL = false;

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
    //plugins: [quadrantPlugin, ChartDataLabels],
    plugins: [quadrantPlugin, myLegendPlugin],
    options: {
        scales: {
            r: {
                display: true,
                angleLines: {
                    display: true,
                },
                grid: {
                    display: true,
                },
                pointLabels: {
                    display: false,
                    color: '#000000',
                    callback: (label) => {
                        return trimOrPad(label, MAX_POINT_LABEL_LEN);
                    },
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

// write viz code here
const drawViz = (data) => {
    // viz.readmeViz();
    // viz.firstViz(data);

    config.data = {
        labels: getLabels(data),
        datasets: getDataSets(data),
    };

    var margin = { top: 0, bottom: 0, right: 0, left: 0 };
    var height = dscc.getHeight() - margin.top - margin.bottom;
    var width = dscc.getWidth() - margin.left - margin.right;

    generatePointLabels(getLabels(data));
    generateStyles(width, height, data);

    var canvasElement = document.createElement('canvas');
    var ctx = canvasElement.getContext('2d');
    canvasElement.id = 'myViz';
    canvasElement.height = height;
    canvasElement.width = width;

    const chartElem = document.getElementById('myViz');
    if (chartElem) {
        chartElem.remove();
    }
    getChartContainer().appendChild(canvasElement);

    var myRadarChart = new Chart(ctx, config);
};

// renders locally
if (DSCC_IS_LOCAL) {
    drawViz(local.message);
} else {
    dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
}
