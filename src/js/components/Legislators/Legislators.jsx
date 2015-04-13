/** @jsx React.DOM */
var React = require('react/addons');

// var Chart = require('../Chart/Chart.jsx');
// var Tooltip = require('../Tooltip/Tooltip.jsx');

require("./Legislators.css");
var Legislators = React.createClass({
  
  render() {

    //var data = this.props.data;
   
    // 支持
    var legiItemsFor = this.props.data
    .filter((item)=>{
        return item.position === '支持';
    })
    .map((item, key)=>{

        var imgURL = require("./images/avatar/"+item.name+".png");
        return (
          <div className="Legislators-avatar"
               key={key}>

            <img className="Legislators-avatarImg"
                 src={imgURL} />
            <div>{item.name}</div>

          </div>
        )
    });


    //未表態
    var legiItemsPending = this.props.data
    .filter((item)=>{
        return item.position === '未表態';
    })
    .map((item, key)=>{

        var imgURL = require("./images/avatar/"+item.name+".png");
        return (
          <div className="Legislators-avatar"
               key={key}>

            <img className="Legislators-avatarImg"
                 src={imgURL} />
            <div>{item.name}</div>

          </div>
        )
    });

    //反對
    var legiItemsAgainst = this.props.data
    .filter((item)=>{
        return item.position === '反對';
    })
    .map((item, key)=>{

        var imgURL = require("./images/avatar/"+item.name+".png");
        return (
          <div className="Legislators-avatar"
               key={key}>
            <img className="Legislators-avatarImg"
                 src={imgURL} />
            <div>{item.name}</div>
            
          </div>
        )
    })
    
    return (
      <div className="Legislators">
        <div className="Legislators-group">
            <div>支持</div>
            {legiItemsFor}
          </div>
        <div className="Legislators-group">
            <div>未表態</div>
            {legiItemsPending}
        </div>
        <div className="Legislators-group">
            <div>反對</div>
            {legiItemsAgainst}
        </div>
      </div>
    );
  }
});


module.exports = Legislators;


