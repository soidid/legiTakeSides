/** @jsx React.DOM */
var React = require('react/addons');

// var Chart = require('../Chart/Chart.jsx');
// var Tooltip = require('../Tooltip/Tooltip.jsx');

require("./Legislators.css");
var Legislators = React.createClass({
  
  render() {

    //var data = this.props.data;
    var groupFilter = this.props.currentGroup;
    //console.log(groupFilter);
   
    // 支持
    var legiItemsFor = this.props.data
    .filter((item)=>{
        return (item.position === '支持') && (item.party === groupFilter || groupFilter === "立法院");
    })
    .map((item, key)=>{

        var imgURL = require("./images/avatar/"+item.name+".png");
        var partyClass = "Legislators-avatar is-"+item.party_eng;
        return (
          <div className={partyClass}
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
        return (item.position === '未表態') && (item.party === groupFilter || groupFilter === "立法院");
    })
    .map((item, key)=>{

        var imgURL = require("./images/avatar/"+item.name+".png");
        var partyClass = "Legislators-avatar is-"+item.party_eng;
        return (
          <div className={partyClass}
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
        return (item.position === '反對') && (item.party === groupFilter || groupFilter === "立法院");
    })
    .map((item, key)=>{

        var imgURL = require("./images/avatar/"+item.name+".png");
        var partyClass = "Legislators-avatar is-"+item.party_eng;
        return (
          <div className={partyClass}
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
            <div className="Legislators-groupTitle">支持</div>
            {legiItemsFor}
          </div>
        <div className="Legislators-group">
            <div className="Legislators-groupTitle">未表態</div>
            {legiItemsPending}
        </div>
        <div className="Legislators-group">
            <div className="Legislators-groupTitle">反對</div>
            {legiItemsAgainst}
        </div>
      </div>
    );
  }
});


module.exports = Legislators;


