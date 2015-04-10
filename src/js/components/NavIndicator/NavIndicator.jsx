/** @jsx React.DOM */
var React = require('react/addons');
require('./NavIndicator.css');

var NavIndicator = React.createClass({

  getInitialState(){
    return {
      
    }
  },
  
  render () {
    var { data, currentIndex, indexHandler } = this.props;
    
    var circleItems = data.map((item, key)=>{

        var classSet = React.addons.classSet;
        var boundClick = indexHandler.bind(null, key);

        var indicatorClasses = classSet({
          "NavIndicator-circle" : true,
          "is-current" : key === currentIndex
        }); 
        return (
          <div className={indicatorClasses}
               onClick={boundClick}></div>

        )
    });

    return (
      <div className="NavIndicator">
          {circleItems}
      </div>
    );
  }
});

module.exports = NavIndicator;
