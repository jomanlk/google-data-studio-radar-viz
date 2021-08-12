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
            QUADRANT: getItem('style.componentQuadrant.value', data),
        },
        FONTSIZE: {
            POINT_LABEL: getItem('style.fontSizePointLabel.value', data, 12),
            LEGEND_TEXT: getItem('style.fontSizeLegendText.value', data, 12),
            SCALE_TICK: getItem('style.fontSizeScaleTick.value', data, 12),
            DATA_LABEL: getItem('style.fontSizeScaleDataLabel.value', data, 12),
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
        domEl.innerHTML = `<span>${trimOrPad(labels.shift(), 13)}</span>`;
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

    //Figure out the size of the legend color block by scaling it along font
    const legendBlockScale = configData.FONTSIZE.LEGEND_TEXT / 12; //12 is the baseline font size
    const legendBlockBaseline = { width: 30, height: 10 };

    style.innerHTML = `
        #chartContainer {   
          width: calc(${smallerDimension}px - 60px); 
          height: calc(${smallerDimension}px - 60px);  
        }

        .label span {
            color: ${configData.COLORS.POINT_LABEL};
            background: ${configData.BG.POINT_LABEL};
            font-size: ${configData.FONTSIZE.POINT_LABEL}px;
        }
        
        .vizLegend {
            width: ${smallerDimension}px;
        }

        .vizLegend .legend {
            font-size: ${configData.FONTSIZE.LEGEND_TEXT}px;
        }

        .vizLegend .color {
            width: ${Math.round(
                legendBlockBaseline.width * legendBlockScale
            )}px;
            height: ${Math.round(
                legendBlockBaseline.height * legendBlockScale
            )}px;
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
    return vizData.fields.metricID.map((metric) => metric.name); //.reverse();
};

export const getDataSets = function (vizData) {
    const datasets = [];
    let seriesId = 0;
    vizData.tables.DEFAULT.map((row) => {
        const dataset = {
            label: row.dimID && row.dimID.length ? row.dimID[0] : '',
            data: row.metricID.map(
                (num) => Math.round((num + Number.EPSILON) * 100) / 100
            ),
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
