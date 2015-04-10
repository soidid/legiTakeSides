var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;

// 讓 store 繼承 EventEmitter 一樣有幾種不同寫法，merge, assign 或是 jQuery 的 .$extend
var merge = require('react/lib/merge');
// var assign = require('object-assign');

// store 改變之後廣播出去的內容
var CHANGE_EVENT = 'change';
var request = require('superagent');

// Store 分成三個大部分：private, public, register self

//========================================================================
//
// Private vars & method

// 定義 store 需要的變數和 method，外界看不到
var _legiData = {};

//========================================================================
//
// Public API 外界可以呼叫的方法

var AppStore = merge(EventEmitter.prototype, {
// assign 的寫法
// var TodoStore = assign({}, EventEmitter.prototype, {

  getData: function() {
    return _legiData;
  },

  //為什麼這個要定義成 public ?
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  
});

//========================================================================
//
// Load Data
var iso3166tw = {
    "CHA": "彰化縣",
    "CYI": "嘉義市",
    "CYQ": "嘉義縣",
    "HSQ": "新竹縣",
    "HSZ": "新竹市",
    "HUA": "花蓮縣",
    "ILA": "宜蘭縣",
    "KEE": "基隆市",
    "KHH": "高雄市",
    "KHQ": "高雄市",
    "MIA": "苗栗縣",
    "NAN": "南投縣",
    "PEN": "澎湖縣",
    "PIF": "屏東縣",
    "TAO": "桃園縣",
    "TNN": "台南市",
    "TNQ": "台南市",
    "TPE": "台北市",
    "TPQ": "新北市",
    "TTT": "台東縣",
    "TXG": "台中市",
    "TXQ": "台中市",
    "YUN": "雲林縣",
    "JME": "金門縣",
    "LJF": "連江縣"
    };
function constituency_area_parser (constituency) {
    switch (constituency[0]) {

        case 'proportional':
            return '全國不分區';
            break;
        case 'aborigine':
            return '山地原住民';
            break;
        case 'foreign':
            return '僑居國外國民';
            break;
        default:
            if (constituency[0] in iso3166tw) {
                result = iso3166tw[constituency[0]];
            } else {
                result = constituency[0] + '<br>' + constituency[1];
            }
            return result;
            break;
        
    }

}
function constituency_parser (constituency) {
    switch (constituency[0]) {

        case 'proportional':
            return '全國不分區';
            break;
        case 'aborigine':
            return '山地原住民';
            break;
        case 'foreign':
            return '僑居國外國民';
            break;
        default:
            if (constituency[0] in iso3166tw) {
                if (constituency[1] == 0) {
                    result = iso3166tw[constituency[0]];
                } else {
                    result = iso3166tw[constituency[0]] + '第' + constituency[1] + '選區';
                }
            } else {
                result = constituency[0] + '<br>' + constituency[1];
            }
            return result;
            break;
        
    }

}
function parseData (argument) {
  // GET Basic data from local
  var lyInfo = require('../../data/ly-info.js').data;
  lyInfo.map((value, key)=>{
      
      value['constituency_area'] = constituency_area_parser(value['constituency']);
      value['constituency'] = constituency_parser(value['constituency']);
      //console.log(value);
      _legiData[value.name] = value;
      

  });

  // GET Position Data from Google Spreadsheets
  
  // REF
  // https://spreadsheets.google.com/feeds/list/1YJwYBacyYvjFIKZgS5cNr2IuXxUypcvvZndOJtydkm8/od6/public/values?alt=json
  // https://github.com/councilor2014/councilor2014.github.io/blob/master/app.js

  var keyPath = "1YJwYBacyYvjFIKZgS5cNr2IuXxUypcvvZndOJtydkm8";
  var jsonPath = "https://spreadsheets.google.com/feeds/list/"+keyPath+"/od6/public/values?alt=json";
  
  var request = require('superagent');
  request
    .get(jsonPath)
    .end(function(err, res){
        var data = res.body;
        data.feed.entry.map((value, key)=>{
            //console.log(value);
            var name = value.gsx$name.$t;
            var position = value.gsx$position.$t;

            _legiData[name].position = position;
            //console.log(name+":"+_legiData[name].position);
        });
        AppStore.emitChange();
         
    });

}
parseData();

///////////////////////////////////////////////////////////////////////////

//========================================================================
//
// event handlers

/**
 * 向 Dispatcher 註冊自已，才能偵聽到系統發出的事件
 */

AppDispatcher.register(function(action) {
  
  switch(action.actionType) {
    
    case AppConstants.LEGI_UPDATE:
      // _update(action.item);
      // AppStore.emitChange();
      break;
    
    default:
      // no op
  }
});

module.exports = AppStore;
