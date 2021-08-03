export const getChartContainer = function () {
    let div = document.getElementById('chartContainer');
    if (!div) {
        div = document.createElement('div');
        div.id = 'chartContainer';
        document.body.appendChild(div);
    }
    return div;
};

export const trimOrPad = function (word, len) {
    if (word.length > len) {
        return `${word.substr(0, len - 3)}...`;
    } else {
        return word.padEnd(len, ' ');
    }
};

export const generatePointLabels = function (labels) {
    const selectors = ['topLabel', 'rightLabel', 'bottomLabel', 'leftLabel'];
    selectors.forEach((selector) => {
        let domEl = document.getElementById(selector);
        if (!domEl) {
            domEl = document.createElement('div');
            domEl.id = selector;
            domEl.innerHTML = trimOrPad(labels.pop(), 13);
            domEl.classList.add('label', selector);
            getChartContainer().appendChild(domEl);
        }
    });
};

export const generateStyles = function (width, height, data) {
    let style = document.getElementById('vizStyles');
    if (!style) {
        const smallerDimension = Math.min(width, height);
        let style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'vizStyles';
        style.innerHTML = `
        #chartContainer {   
          width: calc(${smallerDimension}px - 60px); 
          height: calc(${smallerDimension}px - 60px);  
        }
        
        .vizLegend {
            width: ${smallerDimension}px;
        }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
};

export const hexToRgb = function (hex, opacity = 0.2) {
    if (hex.indexOf('#') > -1) {
        hex = hex.substr(hex.indexOf('#') + 1);
    }

    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const getLabels = function (vizData) {
    return vizData.fields.metricID.map((metric) => metric.name);
};

export const getDataSets = function (vizData) {
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
