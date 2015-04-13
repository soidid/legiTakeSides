/** @jsx React.DOM */
var AppStore = require('../../stores/AppStore');
var AppActions = require('../../actions/AppActions');

var React = require('react/addons');
var PieChart = require('../PieChart/PieChart.jsx');
var NavIndicator = require('../NavIndicator/NavIndicator.jsx');
var Legislators = require('../Legislators/Legislators.jsx');

require('./App.css');

function getData(){
  // Change from Object to Array;
  var data = AppStore.getData();
  var legiData = Object.keys(data).map((value, key)=>{
      return data[value];
  });
  return legiData;
}

var App = React.createClass({

  getInitialState(){
    return {
      data: [],
      currentIndex: 0,
      max: 3,
      legiData: []
    }
  },
  
  componentWillMount () {
      this._onChange();
      this._onSetSize();
      React.initializeTouchEvents(true);
  },

  _onSetIndex(value){
    this.setState({
      currentIndex: value
    });
  },

  componentDidMount () {
      window.addEventListener("resize", this._onSetSize);
      AppStore.addChangeListener(this._onChange);
  },
  
  componentWillUnmount () {
      window.removeEventListener("resize", this._onSetSize);
      AppStore.removeChangeListener(this._onChange);
  },
  
  _onChange (){
      console.log("ON CHANGE");
      var legiData = getData();

      /* === FORMAT === */
      var data = [
          { 
            "group" : "立法院",
            "data": [
              { "text" : "支持", "quantity" : 100},
              { "text" : "反對", "quantity" : 200},
              { "text" : "未表態", "quantity" : 300}
            ]
          },
          { 
            "group" : "KMT",
            "data": [
              { "text" : "支持", "quantity" : 10},
              { "text" : "反對", "quantity" : 1},
              { "text" : "未表態", "quantity" : 4}
            ]
          },
          { 
            "group" : "DPP",
            "data": [
              { "text" : "支持", "quantity" : 99},
              { "text" : "反對", "quantity" : 10},
              { "text" : "未表態", "quantity" : 46}
            ]
          }
       ];
      /* ====== */
      //var data = [];
      if(legiData[0].position){// 表態資料取得

          var stateTemp = {};  // 以 object 形式做紀錄

          legiData.map((value, key)=>{
              // console.log(value.party+": ");// value.party 是中文
              // console.log(value.position);
              
              /* --------- 立法院   --------- */
              if(!stateTemp["立法院"]){
                  stateTemp["立法院"] = {};
              }
              if(!stateTemp["立法院"][value.position]){
                  stateTemp["立法院"][value.position] = 1;

              }else{
                  stateTemp["立法院"][value.position] += 1;
              }

              /* --------- 各 group -------- */
              if(!stateTemp[value.party]){
                  stateTemp[value.party] = {};
              }
              if(!stateTemp[value.party][value.position]){
                  stateTemp[value.party][value.position] = 1;
              }else{
                  stateTemp[value.party][value.position] += 1;
              }

          });
          console.log(stateTemp);
          // Clear default data
          data = [];
          // 把資料整理成 group 
          // 這裏需要 「全立法院的資料」
          for(var group_key in stateTemp){
              var stateItem = {};
              stateItem.group = group_key;
              stateItem.data = [];
              for(var position_key in stateTemp[group_key]){
                  stateItem.data.push({
                    "text": position_key,
                    "quantity" : stateTemp[group_key][position_key]
                  });
              }
              data.push(stateItem);
          }

          this.setState({
              data: data,
              legiData: legiData
          });

      }else{
          this.setState({
            data: "",
            legiData: legiData
          });
      }
      
  },
 
  _onSetSize() {
    var width = (window.innerWidth > 500) ? 500 : window.innerWidth;
    var height = (window.innerWidth > 500) ? 400 : width * 3/4;
    this.setState({
        width: width,
        height: height
    });
  },

  _onTouchStart(event){
    this.setState({
      touchStartX: event.touches[0].clientX,
      touchStartY: event.touches[0].clientY
    });
  },

  _getPreIndex(currentIndex){
    var preIndex = currentIndex -1;
        if(preIndex < 0)
           preIndex = this.state.max;
    return preIndex;

  },

  _getNextIndex(currentIndex){
      var nextIndex = currentIndex + 1;
        if(nextIndex > this.state.max)
           nextIndex = nextIndex % (this.state.max+1);
      return nextIndex;
  },

  _onTouchEnd(event){
    var state = this.state;
    var moveX = state.touchEndX - state.touchStartX;
    var moveY = state.touchEndY - state.touchStartY;
   
    currentIndex = state.currentIndex;

    //console.log("x:"+Math.abs(moveX)+", y:"+Math.abs(moveY));
    // 40 is threshold
    if(Math.abs(moveX) < 40 || Math.abs(moveY) > 50){
       return;

    }
    // Slide Direction
    if(moveX > 0){//toggle Prev
        currentIndex = this._getPreIndex(currentIndex);
    
    }else{//toggle Next
        currentIndex = this._getNextIndex(currentIndex);
       
    }
    
    this.setState({
      currentIndex: currentIndex
    });
    
  },

  _onTouchMove(event){
    this.setState({
      touchEndX: event.touches[0].clientX,
      touchEndY: event.touches[0].clientY
    });
  },

  render () {
    var { data, currentIndex, width, height, legiData} = this.state;
    var classSet = React.addons.classSet;
    //var colorRange = ["#0b64a0", "#5098d8", "#80b2e0", "#afcfef", "#d4e6f9",  "#fcedd6", "#f7e3bf", "#fcce65", "#fec92d", "#f4b425"];
    var colorRange = ["#5098d8","#EB5635", "#ccc"];


    var tooltip = {
        "hidden" : true,
        "top" : "10px",
        "left" : "100px",
        "html" : "hello"
        };
    //console.log(data[currentIndex]);
    var navItem = "";
    if(data){
      navItem = (data[currentIndex].data) ? 
                <NavIndicator data={data}
                              currentIndex={this.state.currentIndex}
                              indexHandler={this._onSetIndex} /> : "";
    }
    

    var preIndex = this._getPreIndex(currentIndex);
    var nextIndex = this._getNextIndex(currentIndex);
    
    var groupTitle = "";
    var pieChart = "";
    var groupItem = "";
    if(data){
        groupTitle = <div className="App-title">{data[currentIndex].group}怎麼說</div>;
        pieChart = <PieChart colorRange={colorRange} 
                             data={data[currentIndex].data} 
                             width={width}
                             height={height}
                             innerWidth={width-100} 
                             innerHeight={height-30} 
                             tooltip={tooltip} />;
        groupItem = data.map((item, key)=>{
            var currentIndex = this.state.currentIndex;
            var boundClick = this._onSetIndex.bind(null,key);
            var groupClasses = classSet({
              "App-group" : true,
              "is-focus" : key === currentIndex
            });
            return (
              <div className={groupClasses}
                   key={key}
                   onClick={boundClick}>{item.group}</div>
            );
        });
    }

    var legiItems = "";
    if(data){
        legiItems = <Legislators data={legiData}
                     currentGroup={data[currentIndex].group}/>
    }
    
    return (
      <div className="App"
           onTouchStart={this._onTouchStart}
           onTouchEnd={this._onTouchEnd}
           onTouchMove={this._onTouchMove}>
        
        <div className="App-content">
          {groupTitle}
          {pieChart}
          {groupItem}
  
          <div>
              {legiItems}
          </div>

          <div>圖表說明：
               把，在<a className="App-link" href="https://docs.google.com/spreadsheets/d/1YJwYBacyYvjFIKZgS5cNr2IuXxUypcvvZndOJtydkm8/edit?usp=sharing"
                    target="_blank">google表單</a>填寫的立場資料，畫成圖表。
          </div>

        </div>
      </div>
    );
  }
});

module.exports = App;


