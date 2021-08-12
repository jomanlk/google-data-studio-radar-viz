export const quadrantPlugin = {
    id: 'quadrants',
    afterDraw: (chart, args, options) => {
        const lineColor = options.color || '#000000';
        const canvas = chart.canvas;

        const pixelRatio = chart.currentDevicePixelRatio;
        const canvasWidth = canvas.width / pixelRatio;
        const canvasHeight = canvas.height / pixelRatio;
        const quadrantLength = canvasWidth / 4;
        const tickPadAdjust = 0;

        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(
            quadrantLength + tickPadAdjust,
            quadrantLength + tickPadAdjust
        );
        ctx.lineTo(
            canvasWidth - quadrantLength - tickPadAdjust,
            canvasHeight - quadrantLength + tickPadAdjust
        );
        ctx.stroke();

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(
            (quadrantLength + tickPadAdjust) * 3,
            quadrantLength + tickPadAdjust
        );
        ctx.lineTo(
            quadrantLength - tickPadAdjust,
            canvasHeight - quadrantLength + tickPadAdjust
        );
        ctx.stroke();

        ctx.restore();
    },
    afterRender: (chart) => {},
};

export const myLegendPlugin = {
    id: 'my_legend',
    afterDraw: (chart) => {
        let legendDiv = document.getElementById('vizLegend');
        if (!legendDiv) {
            legendDiv = document.createElement('div');
            legendDiv.id = 'vizLegend';
            legendDiv.className = 'vizLegend';
            document.body.appendChild(legendDiv);

            legendDiv.addEventListener('click', (e) => {
                const datasetId = e.target.dataset.legendDataset;
                const datasets = chart.config.data.datasets;
                if (typeof datasetId !== 'undefined') {
                    datasets[datasetId].hidden = !!!datasets[datasetId].hidden;
                    chart.update();
                }
            });
        }
        let legendHtml = '';
        chart.config.data.datasets.forEach((dataset, key) => {
            legendHtml += `<div data-legend-dataset="${key}" class="${
                dataset.hidden == true ? 'hidden' : ''
            }">
                <span class="color" style="border-color:${
                    dataset.borderColor
                } ;background-color:${dataset.backgroundColor}"></span>
                <span class="legend">${dataset.label}</span>
                </div>`;
        });
        legendDiv.innerHTML = legendHtml;
    },
};
