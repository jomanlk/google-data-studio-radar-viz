export const getPopulateConfigs = function (data) {
    const configs = {
        SCALE: {
            MIN: getItem('style.scaleMin.value', data) || undefined,
            MAX: getItem('style.scaleMax.value', data) || undefined,
        },
        COLORS: {
            QUADRANT_LINE:
                getItem('style.colorQuadrantLine.value.color', data) ||
                undefined,
            GRID_LINE:
                getItem('style.colorGridLine.value.color', data) || undefined,
            ANGLE_LINE:
                getItem('style.colorAngleLine.value.color', data) || undefined,
            POINT_LABEL:
                getItem('style.colorPointLabel.value.color', data) || undefined,
            SCALE_TICK:
                getItem('style.colorScaleTick.value.color', data) || undefined,
        },
        BG: {
            SCALE_TICK:
                getItem('style.bgScaleTick.value.color', data) || undefined,
            POINT_LABEL:
                getItem('style.bgPointLabel.value.color', data) || undefined,
        },
        COMPONENT: {
            DATA_LABEL: getItem('style.componentDataLabel.value', data),
            SCALE_TICK: getItem('style.componentTick.value', data),
            TOOLTIP: getItem('style.componentTooltip.value', data),
        },
    };

    return configs;
};

export const getItem = function (key, data, def = '') {
    const keys = key.split('.');
    let ref = data;
    while (keys.length > 0) {
        const key = keys.shift();
        if (typeof ref[key] == 'undefined') {
            return def;
        }
        ref = ref[key];
    }
    return ref;
};

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
            domEl.classList.add('label', selector);
            getChartContainer().appendChild(domEl);
        }
        domEl.innerHTML = `<span>${trimOrPad(labels.pop(), 13)}</span>`;
    });
};

export const generateStyles = function (width, height, configData) {
    let style = document.getElementById('vizStyles');
    if (!style) {
        style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'vizStyles';
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    const smallerDimension = Math.min(width, height);
    style.innerHTML = `
        #chartContainer {   
          width: calc(${smallerDimension}px - 60px); 
          height: calc(${smallerDimension}px - 60px);  
        }

        .label span {
            color: ${configData.COLORS.POINT_LABEL};
            background: ${configData.BG.POINT_LABEL};
        }
        
        .vizLegend {
            width: ${smallerDimension}px;
        }
     `;
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
