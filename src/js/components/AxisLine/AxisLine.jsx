/** @jsx React.DOM */

//ref https://github.com/esbullington/react-d3/blob/master/src/common/axes/AxisLine.jsx

var React = require('react');
var d3 = require('d3');

var AxisLine = React.createClass({
  
  displayName: 'AxisLine',

  getDefaultProps() {
    return {
      innerTickSize: 1,
      outerTickSize: 1,
      tickPadding: 5,
      fill: "black",
      stroke: "black",
      strokeWidth: 1,
      tickArguments: [10],
      tickValues: null,
      tickFormat: null
    };
  },

  render() {

    var { orientation,
          outerTickSize,
          height,
          width,
          fill,
          stroke,
          strokeWidth } = this.props;

    var sign = (orientation === "top" || orientation === "left") ? -1 : 1;
   
    var range = (orientation === "top" || orientation === "bottom") ? [0, width] : [0, height];
    
  
    var d;
    if (orientation === "bottom" || orientation === "top") {
        d = "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize;
    } else {
        d = "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize;
    }
    return (
      <path
        className="domain"
        d={d}
        style={{'shapeRendering':'crispEdges'}}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth} />
    );
  }
});

module.exports =  AxisLine;