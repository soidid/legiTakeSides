/** @jsx React.DOM */
var React = require('react/addons');
var d3 = require("d3");
require("./Tooltip.css");
var Tooltip = React.createClass({
  
  getDefaultProps() {
    return {
      top: 150,
      left: 100,
      html: ""
    };
  },

  

  render() {
    var {top, left, hidden, html} = this.props;

    var style = {
      display: hidden ? "none" : "block",
      position: "fixed",
      top: top,
      left: left
    };

    return (
        <div className="Tooltip" 
             style={style}>
             {html}
        </div>
    );
  }
});


module.exports = Tooltip;


