/** @jsx React.DOM */
//ref https://github.com/esbullington/react-d3/blob/master/src/common/axes/AxisTicks.jsx

var React = require('react');
var d3 = require('d3');

var AxisTicks = React.createClass({
  
    displayName: 'AxisTick',
    getDefaultProps() {
        return {
          tickValues: null,
          tickFormat: null,
          innerTickSize: 10,// 長度
          tickPadding: 3,  // tick 和 label 之間的距離
          strokeWidth: 1
        };
    },
    render() {
        var { scale, 
              innerTickSize, 
              tickPadding,
              strokeWidth,
              orientation, 
              width, 
              height } = this.props;

        var ticks = scale.domain();
        var tickSpacing = Math.max(innerTickSize, 0) + tickPadding;
    
        var sign = orientation === "top" || orientation === "left" ? -1 : 1;
        var range = (orientation === "top" || orientation === "bottom") ? [0, width] : [0, height];
        var activeScale = scale.rangeBand ? e => { return scale(e) + scale.rangeBand() / 2; } : scale;

        var transform, x, y, x2, y2, dy, textAnchor;
        
        if (orientation === "bottom" || orientation === "top") {
            transform = "translate({}, 0)";
            x = 0;
            y = sign * tickSpacing;
            x2 = 0;
            y2 = sign * innerTickSize;
            dy = sign < 0 ? "0em" : ".71em";
            textAnchor = "middle";
    
        } else {
            transform = "translate(0, {})";
            x = sign * tickSpacing;
            y = 0;
            x2 = sign * innerTickSize;
            y2 = 0;
            dy = ".32em";
            textAnchor = sign < 0 ? "end" : "start";
        }
    
        var tickElements = ticks.map((tick, index) => {
            var position = activeScale(tick);
            var translate = transform.replace("{}", position);
            // console.log(position);
            // console.log(translate);
            return (
                <g key={tick + "." + index} className="tick" transform={translate}>
                  <line x2={x2} y2={y2} stroke="#000" strokeWidth={strokeWidth} fill="#000"/>
                  <text x={x} y={y} dy={dy} textAnchor={textAnchor}>{tick}</text>
                </g>
            );
        });
    
        return (
          <g>{tickElements}</g>
        )
    
    }
});

module.exports =  AxisTicks;