/** @jsx React.DOM */
var React = require('react/addons');
var d3 = require("d3");
var Chart = require('../Chart/Chart.jsx');
var Tooltip = require('../Tooltip/Tooltip.jsx');


var hightlightColor = "#fcce65";
var PieChart = React.createClass({

 
  getInitialState() {
    return {
      tooltip : {},
      currentHoverIndex : -1,
      colorRange: this.props.colorRange
    };
  },

  componentWillMount(){
    this.setState({
      tooltip: this.props.tooltip
    })
  },

  _onChangeTooltip(i, event){
    
    var tooltip = this.state.tooltip;
    tooltip.html = i.percentage;//quantity;
    
    tooltip.top = event.clientY;
    tooltip.left = event.screenX;
    tooltip.hidden = false;
    //console.log(tooltip.top + "," + tooltip.left);
    this.setState({
      tooltip: tooltip
    })

  },
  _onLeaveTooltip(i, event){
    var tooltip = this.state.tooltip;
    tooltip.hidden = true;
    this.setState({
      tooltip: tooltip
    })

  },

  

  _color() {
    var rangeData = [];
    var dataLength = this.props.data.length;
    var colorLength = this.state.colorRange.length;
    for(var i = 0; i < colorLength; i++){
      rangeData.push(dataLength * i / colorLength);
    }
    return d3.scale.linear()
      .domain(rangeData)
      .range(this.state.colorRange); 
  },

 

  //arc 只是 group 的概念，像是 rect, path
  _arc() {
    var radius      = Math.min(this.props.innerWidth, this.props.innerHeight) / 2;
    var innerRadius = (Math.min(this.props.innerWidth, this.props.innerHeight) / 2) * 0.8;
    var outerRadius = (Math.min(this.props.innerWidth, this.props.innerHeight) / 2) * 0.4;
    var labelRadius = (Math.min(this.props.innerWidth, this.props.innerHeight) / 2) * 0.9;

    return d3.svg.arc()
             .innerRadius(innerRadius)
             .outerRadius(outerRadius - 10);
     
  },

  _outerArc(){
    var radius      = Math.min(this.props.innerWidth, this.props.innerHeight) / 2;
    var innerRadius = (Math.min(this.props.innerWidth, this.props.innerHeight) / 2) * 0.8;
    var outerRadius = (Math.min(this.props.innerWidth, this.props.innerHeight) / 2) * 0.4;
    var labelRadius = (Math.min(this.props.innerWidth, this.props.innerHeight) / 2) * 0.9;
    return d3.svg.arc()
             .innerRadius(labelRadius)
             .outerRadius(labelRadius);
  },

  //把 data 轉成實際上可以畫的數據
  _pie(data) {
    return d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.quantity; }).call(null,data);
  },
  
  //為了製造動畫效果，一開始大家都是 1
  _pieStart(data) {
    return d3.layout.pie()
      .sort(null)
      .value(function(d) { return 1; }).call(null,data);
  },

  _renderGraph () {
    var _this = this;
    var data = this.props.data;

    //計算百分比
    var sum = 0;
    data.map((item, key)=>{
         sum += item.quantity;
    });
    data.map((item, key)=>{
         item.percentage = Math.round((item.quantity)/sum * 100, 0);
         item.percentage += "%";
    });
    
   
    var _pie = this._pie(data);
    var _arc = this._arc;
    var currentHoverIndex = this.state.currentHoverIndex;

    var g =  d3.select(this.getDOMNode())
               .selectAll("path")
               
               .style("fill", function(d, i) { 
                  //var c = _this._color().call(null, i);
                  var c = this.fill;
                  var fillC = ( currentHoverIndex === i) ? hightlightColor : c;
                  return fillC;
                })
               //.transition().duration(1000)
               
               .attr("d", function(v,index){
                  var d = _arc().call(null, _pie[index]);
                  return d;

                });
  },

  componentDidMount () {
    this._renderGraph();
  },

  componentDidUpdate () {
    //console.log("component update!");

    this._renderGraph();
  },

  _onChangeColor(i) {
    //console.log(i);
    this.setState({
      currentHoverIndex: i.index
    });
  },

  _onResetColor() {
    //console.log(i);
    this.setState({
      currentHoverIndex: -1
    });
  },

  render() {
    var { width,
          height,
          innerWidth,
          innerHeight,
          data } = this.props;

    var { tooltip,
          currentHoverIndex } =  this.state;

    var pieData = this._pie(data);
    var pieStartData = this._pieStart(data);

    var _arc = this._arc;
    var _outerArc = this._outerArc;
    var _color = this._color;

    var arcItems = pieData.map((e,key)=>{
        var d1 = _arc().call(null,e);
        //var d = _arc().call(null, pieStartData[key]);
        var d = _arc().call(null, pieData[key]);
        
        
        
        //計算文字位置
        var radius = Math.min(innerWidth, innerHeight) / 2;
        function midAngle(d){
          return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        var labelPos = _outerArc().centroid.call(null,e);
        //console.log(labelPos);
        labelPos[0] = radius * (midAngle(e) < Math.PI ? 1 : -1);
        var textAnchor = midAngle(e) < Math.PI ? "start" : "end";
        var style = {
          "text-anchor" : textAnchor
        };
        // console.log(labelPos);
        // console.log("------------");


        //計算標線位置
        var linePos = _outerArc().centroid.call(null,e);
        linePos[0] = radius * 0.95 * (midAngle(e) < Math.PI ? 1 : -1);
     
        var handleMove = this._onChangeTooltip.bind(null, e.data);
        var handleLeave = this._onLeaveTooltip.bind(null, e.data);

        // <text transform={"translate("+centroid[0]+","+centroid[1]+")"}
        //       dy={".35em"}
        //       style={style}>e.data.text</text>

        var innerPoint = _arc().centroid.call(null,e);
        var outerPoint = _outerArc().centroid.call(null, e);
        
        var boundChangeColor = this._onChangeColor.bind(null, {data: e.data, index: key});
        
        var c = _color().call(null, key);// 原本依照 index 的顏色
        
        var colorForPosition = "none";
        
        if(e.data.text === "支持"){
            colorForPosition = "#5098d8";
        }else if(e.data.text === "反對"){
            colorForPosition = "#EB5635";
        }else{
            colorForPosition = "#ccc";
        }

        var fillC = (currentHoverIndex === key) ? hightlightColor : colorForPosition;
        
        return (
          <g className="arc"
             data={e.data}
             onMouseMove={handleMove}
             onMouseLeave={handleLeave}>
              <path fill={colorForPosition} 
                    d={d}
                    onMouseEnter={boundChangeColor}
                    onMouseLeave={this._onResetColor}/>

              <polyline
                  opacity={1}
                  strokeWidth={1}
                  stroke={"#666"}
                  fill={"none"}
                  points={[innerPoint, outerPoint, linePos]} />

              <text dy=".35em"
                    x={labelPos[0]}
                    y={labelPos[1]}
                    style={style}>{e.data.text}</text>
          </g>
        )
        
    });
    return (
      <div>
      <svg width={width} height={height}>
          <g transform={"translate(" + width/2 + "," + height/2 + ")"}>
             {arcItems}
          </g>

      </svg>
      <Tooltip
          hidden={tooltip.hidden}
          top={tooltip.top}
          left={tooltip.left}
          html={tooltip.html}/></div>
    );
  }
});


module.exports = PieChart;


