/*!
 * Chart.CurrentMarker.js
 * http://www.threerabbits.io/opensource/
 * Version: 0.1.0
 *
 * Copyright 2016 Pascal Ehlert
 * Released under the MIT license
 * https://github.com/pehlert/Chart.CurrentMarker.js/blob/master/LICENSE.md
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CurrentMarkerLine = function (_Chart$Element) {
  _inherits(CurrentMarkerLine, _Chart$Element);

  function CurrentMarkerLine(args) {
    _classCallCheck(this, CurrentMarkerLine);

    var _this = _possibleConstructorReturn(this, (CurrentMarkerLine.__proto__ || Object.getPrototypeOf(CurrentMarkerLine)).call(this, args));

    args.config = args.config || {};
    _this.config = {
      lineWidth: args.config.lineWidth || 1,
      lineColor: args.config.lineColor || 'rgba(46, 153, 122, 1)',
      lineDash: args.config.lineDash || [5, 3],
      textColor: args.config.textColor || 'rgb(255, 255, 255)',
      font: args.config.font || '18px Helvetica'
    };
    return _this;
  }

  _createClass(CurrentMarkerLine, [{
    key: 'draw',
    value: function draw(ctx) {
      ctx.save();

      var view = this._view;

      ctx.lineWidth = this.config.lineWidth;
      ctx.lineColor = this.config.lineColor;
      ctx.fillStyle = this.config.lineColor;
      ctx.setLineDash(this.config.lineDash);

      // Configuration
      var handleWidth = 100;
      var triangleWidth = 15;
      var handleHeight = 30;
      var handlePaddingLeft = 5;

      // Draw line
      ctx.beginPath();
      ctx.moveTo(view.x1, view.y1);
      ctx.lineTo(view.x2 - handleWidth - triangleWidth - handlePaddingLeft, view.y2);
      ctx.stroke();

      // Draw handle body
      var handleY = view.y2 - handleHeight / 2;
      var handleX = view.x2 - handleWidth;
      ctx.fillRect(handleX, handleY, handleWidth, handleHeight);

      // Draw handle triangle
      var triangleX = handleX - triangleWidth;
      var triangleY = handleY + handleHeight / 2;
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
      ctx.fillText(view.valueText, handleX + handleWidth / 2, view.y2 + 5);

      ctx.restore();
    }
  }]);

  return CurrentMarkerLine;
}(Chart.Element);

var CurrentMarkerPlugin = function (_Chart$PluginBase) {
  _inherits(CurrentMarkerPlugin, _Chart$PluginBase);

  function CurrentMarkerPlugin() {
    _classCallCheck(this, CurrentMarkerPlugin);

    return _possibleConstructorReturn(this, (CurrentMarkerPlugin.__proto__ || Object.getPrototypeOf(CurrentMarkerPlugin)).apply(this, arguments));
  }

  _createClass(CurrentMarkerPlugin, [{
    key: 'beforeInit',
    value: function beforeInit(chartInstance) {
      this.config = chartInstance.options.currentMarker || {};
      chartInstance._currentMarker = new CurrentMarkerLine({ _index: 0, config: this.config });
    }
  }, {
    key: 'afterDraw',
    value: function afterDraw(chartInstance, easingDecimal) {
      var data = chartInstance.data.datasets[0].data;
      var lastValue = data[data.length - 1];
      var ctx = chartInstance.chart.ctx;
      var currentMarker = chartInstance._currentMarker;

      var model = currentMarker._model = currentMarker._model || {};
      var scale = chartInstance.scales['y-axis-1'];
      var pixel = scale ? scale.getPixelForValue(lastValue) : NaN;
      var chartArea = chartInstance.chartArea;

      if (!isNaN(pixel)) {
        model.x1 = chartArea.left;
        model.x2 = chartArea.right;
        model.y1 = model.y2 = pixel;
        model.valueText = lastValue.y.toFixed(this.config.decimals || 0);
      }

      chartInstance._currentMarker.transition(easingDecimal).draw(ctx);
    }
  }]);

  return CurrentMarkerPlugin;
}(Chart.PluginBase);

Chart.pluginService.register(new CurrentMarkerPlugin());