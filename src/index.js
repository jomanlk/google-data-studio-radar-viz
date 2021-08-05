const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');
import { Chart, registerables } from 'chart.js';
import { quadrantPlugin, myLegendPlugin } from './plugins';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    getPopulateConfigs,
    getData,
    trimOrPad,
    generatePointLabels,
    generateStyles,
    hexToRgb,
    getLabels,
    getDataSets,
    getChartContainer,
} from './helpers';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

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

// write viz code here
const drawViz = (data) => {
    // viz.readmeViz();
    // viz.firstViz(data);
    // npm run update_message -> to see text

    const configData = getPopulateConfigs(data);

    const config = {
        type: 'radar',
        data: {
            labels: getLabels(data),
            datasets: getDataSets(data),
        },
        //plugins: [quadrantPlugin, ChartDataLabels],
        plugins: [quadrantPlugin, myLegendPlugin],
        options: {
            scales: {
                r: {
                    display: true,
                    suggestedMax: configData.SCALE.MAX,
                    suggestedMin: configData.SCALE.MIN,
                    angleLines: {
                        display: true,
                        color: configData.COLORS.ANGLE_LINE,
                    },
                    grid: {
                        display: true,
                        color: configData.COLORS.GRID_LINE,
                    },
                    pointLabels: {
                        display: false,
                    },
                    ticks: {
                        display: configData.COMPONENT.SCALE_TICK,
                        color: configData.COLORS.SCALE_TICK,
                        backdropColor: configData.BG.SCALE_TICK,
                    },
                },
            },
            plugins: {
                datalabels: configData.COMPONENT.DATA_LABEL,
                quadrants: {
                    color: configData.COLORS.QUADRANT_LINE,
                },
                legend: {
                    display: false,
                },
                filler: {
                    propagate: false,
                },
                tooltip: {
                    enabled: configData.COMPONENT.TOOLTIP,
                },
            },
            interaction: {
                intersect: false,
            },
        },
    };

    var margin = { top: 0, bottom: 0, right: 0, left: 0 };
    var height = dscc.getHeight() - margin.top - margin.bottom;
    var width = dscc.getWidth() - margin.left - margin.right;

    generatePointLabels(getLabels(data));
    generateStyles(width, height, configData);

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
