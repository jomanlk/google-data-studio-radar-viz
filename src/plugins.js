export const quadrantPlugin = {
    id: 'draw_quadrants',
    afterDraw: (chart) => {
        const canvas = chart.canvas;
        const lengthAdjust = canvas.width / 4;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(lengthAdjust, lengthAdjust + 10);
        ctx.lineTo(canvas.width - lengthAdjust, canvas.height - lengthAdjust);
        ctx.stroke();

        ctx.lineWidth = 0.1;
        ctx.beginPath();
        ctx.moveTo(lengthAdjust * 3 - 3, lengthAdjust + 7);
        ctx.lineTo(lengthAdjust, canvas.height - lengthAdjust);
        ctx.stroke();

        ctx.restore();
    },
    afterRender: (chart) => {},
};

export const myLegendPlugin = {
    id: 'my_lgend',
    afterDraw: (chart) => {
        let legendDiv = document.getElementById('vizLegend');
        if (!legendDiv) {
            legendDiv = document.createElement('div');
            legendDiv.id = 'vizLegend';
            legendDiv.className = 'vizLegend';
            document.body.appendChild(legendDiv);

            legendDiv.addEventListener('click', (e) => {
                console.log('ddd');

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
