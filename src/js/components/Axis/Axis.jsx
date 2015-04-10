/** @jsx React.DOM */
var React = require('react/addons');
var d3 = require("d3");
var AxisLine = require('../AxisLine/AxisLine.jsx');
var AxisTicks = require('../AxisTicks/AxisTicks.jsx');

var Axis = React.createClass({
  
  
  render: function() {
    var { width, height, scale, type, margin } = this.props;
    var axis = <g></g>;
    // console.log(type);
    // console.log(scale);

    if(type === "x-axis"){
        // x-axis
        axis = (
        <g transform={"translate("+margin+","+height+")"}>
            <AxisLine width={width} height={height} orientation="bottom"/>
            <AxisTicks width={width} height={height} scale={scale} orientation="bottom"/>
        </g>);

    }else{
      // y-axis
      axis = (
      <g transform={"translate("+margin+","+margin+")"}>
          <AxisLine width={width} height={height} orientation="left"/>
          <AxisTicks width={width} height={height} scale={scale} orientation="left"/>
          
      </g>);

    }
  
    return (
      axis

    );
  }
});

module.exports = Axis;


