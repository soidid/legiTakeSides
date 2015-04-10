/** @jsx React.DOM */
var React = require('react/addons');

// var Chart = require('../Chart/Chart.jsx');
// var Tooltip = require('../Tooltip/Tooltip.jsx');

var Legislators = React.createClass({
  
  render() {

    //var data = this.props.data;
   
    var legiItems = this.props.data.map((item, key)=>{
        return (
          <div key={key}>
            {item.constituency}
          </div>
        )
    })
    
    return (
      <div>
     
      </div>
    );
  }
});


module.exports = Legislators;


