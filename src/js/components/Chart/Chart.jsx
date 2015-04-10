/** @jsx React.DOM */

var React = require('react/addons');

var d3 = require("d3");
var Chart = React.createClass({
  render: function() {
  	
    return (
        <svg width={this.props.width} 
             height={this.props.height}>{this.props.children}
        </svg>
    );
  }
});

module.exports = Chart;


