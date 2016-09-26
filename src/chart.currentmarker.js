class CurrentMarkerLine extends Chart.Element {
  constructor(args) {
    super(args);
    this.setConfig(args.config || {});
  }

  setConfig(config) {
    this.config = {
      lineWidth: config.lineWidth || 1,
      lineColor: config.lineColor || 'rgba(46, 153, 122, 1)',
      lineDash: config.lineDash || [5, 3],
      textColor: config.textColor || 'rgb(255, 255, 255)',
      font: config.font || '18px Helvetica'
    };
  }

  draw(ctx) {
    ctx.save();

    const view = this._view;

    ctx.lineWidth = this.config.lineWidth;
    ctx.lineColor = this.config.lineColor;
    ctx.fillStyle = this.config.lineColor;
    ctx.setLineDash(this.config.lineDash);

    // Configuration
    const handleWidth = 100;
    const triangleWidth = 15;
    const handleHeight = 30;
    const handlePaddingLeft = 5;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(view.x1, view.y1);
    ctx.lineTo(view.x2 - handleWidth - triangleWidth - handlePaddingLeft, view.y2);
    ctx.stroke();

    // Draw handle body
    const handleY = view.y2 - (handleHeight / 2);
    const handleX = view.x2 - handleWidth;
    ctx.fillRect(handleX, handleY, handleWidth, handleHeight);

    // Draw handle triangle
    const triangleX = handleX - triangleWidth;
    const triangleY = handleY + (handleHeight / 2);
    ctx.setLineDash([0]);
    ctx.beginPath();
    ctx.moveTo(triangleX, triangleY);
    ctx.lineTo(handleX, handleY);
    ctx.lineTo(handleX, handleY + handleHeight);
    ctx.fill();

    // Draw handle text
    ctx.fillStyle = this.config.textColor;
    ctx.font = this.config.font;
    ctx.textBaseLine = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(view.valueText, handleX + (handleWidth / 2), view.y2 + 5);

    ctx.restore();
  }
}

class CurrentMarkerPlugin extends Chart.PluginBase {
  beforeInit(chartInstance) {
    this.config = chartInstance.options.currentMarker || {};
    chartInstance._currentMarker = new CurrentMarkerLine({ _index: 0, config: this.config });
  }

  beforeDraw(chartInstance) {
    this.config = chartInstance.options.currentMarker || {};
    chartInstance._currentMarker.setConfig(this.config);
  }

  afterDraw(chartInstance, easingDecimal) {
    const data = chartInstance.data.datasets[0].data;
    const lastValue = data[data.length - 1];
    const ctx = chartInstance.chart.ctx;
    const currentMarker = chartInstance._currentMarker;

    const model = currentMarker._model = currentMarker._model || {};
    const scale = chartInstance.scales['y-axis-1'];
    const pixel = scale ? scale.getPixelForValue(lastValue) : NaN;
    const chartArea = chartInstance.chartArea;

    if (!isNaN(pixel)) {
      model.x1 = chartArea.left;
      model.x2 = chartArea.right;
      model.y1 = model.y2 = pixel;
      model.valueText = lastValue.y.toFixed(this.config.decimals || 0);
    }

    chartInstance._currentMarker.transition(easingDecimal).draw(ctx);
  }
}

Chart.pluginService.register(new CurrentMarkerPlugin());
