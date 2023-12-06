import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';


// Data object - is also used by Vue

var vuedata = {
  page: 'organizations',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  modalShowTable: 'a',
  flagsTranslations: {
    "Nominees as company board members or beneficial owners": "Variomanik(ud) nõukogu liikme või tegeliku kasusaajana",
    "Possible shell company": "Võimalik riiulifirma",
    "Large political donor": "Suur poliitiline annetaja",
    "Special purpose company": "Uus firma"
  },
  charts: {
    flags: {
      title: 'Riskid',
      info: 'Riskinäitajad, mis võivad osutada ebakohasele mõjule, korruptsiooniohule või huvide konfliktile.'
    },
    topContractors: {
      title: 'TOP töövõtjad',
      info: 'TOP15 töövõtjat (kõigi andmebaasis leiduvate hanketeadete järgi)'
    },
    topContracting: {
      title: 'TOP hankijad',
      info: 'TOP15 hankijat (kõigi andmebaasis leiduvate hanketeadete järgi)'
    },
    beneficialOwners: {
      title: 'Tegelikud kasusaajad',
      info: 'TOP15 tegelikku kasusaajat (ettevõtete arvu järgi)'
    },
    country: {
      title: 'Riik',
      info: 'Riik, kus juriidiline isik on registreeritud'
    },
    donations: {
      title: 'Annetused erakondadele',
      info: 'Annetused erakondadele annetuste kogusumma järgi'
    },
    topDonors: {
      title: 'TOP poliitilised annetajad',
      info: 'TOP15 poliitilised annetajad - rahastus kas juriidilise isiku või juriidilise isiku tegeliku kasusaaja poolt.'
    },
    topOwners: {
      title: 'TOP tegelikud kasusaajad',
      info: 'TOP15 tegelikud kasusaajad - ettevõtete arvu järgi'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Juriidilised isikud',
      info: 'Järjestatavas tabelis on esitatud kõik juriidilised isikud, mis valitud aktiivsetele filtritele vastavad.'
    }
  },
  selectedEl: {"Name": ""},
  categoriesTranslations: {
    "SERVICES": "teenused",
    "SUPPLIES": "asjad",
    "WORKS": "ehitustööd",
    "N/A": "ei kehti"
  },
  colors: {
    default: "#00A2AB",
    flags: "#f22241",
    range: ["#00A2AB", "#33B5BC", "#66C7CD", "#99DADD", "#fcab42", "#F29222"],
    rangeVarious: ["#00A2AB", "#F29222", "#64B45A", "#cccccc"],
    colorSchemeCloud: ["#00A2AB", "#33B5BC", "#007b82", "#64B45A", "#7dc773", "#F29222"],
    sunburst: {
      'Notice': {
        'Flagged': '#f22241',
        'No flags': '#72b9e8',
        'base': '#3b95d0'
      },
      'Award notice': {
        'Flagged': '#bf341b',
        'No flags': '#ffe566',
        'base': '#ebcc34'
      }
    }
    //colorSchemeCloud: ["#62aad9", "#3b95d0", "#b7bebf", "#1a6da3", "#e3b419", "#e39219", "#de7010"]
  }
}

//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Ausa Riigi Valvur ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = 'https://ausriik.ee';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})


//Charts
var charts = {
  topContractors: {
    chart: dc.rowChart("#topcontractors_chart"),
    type: 'row',
    divId: 'topcontractors_chart'
  },
  topContracting: {
    chart: dc.rowChart("#topcontracting_chart"),
    type: 'row',
    divId: 'topcontracting_chart'
  },
  beneficialOwners: {
    chart: dc.pieChart("#beneficialowners_chart"),
    type: 'pie',
    divId: 'beneficialowners_chart'
  },
  country: {
    chart: dc.pieChart("#country_chart"),
    type: 'pie',
    divId: 'country_chart'
  },
  donations: {
    chart: dc.pieChart("#donations_chart"),
    type: 'pie',
    divId: 'donations_chart'
  },
  topDonors: {
    chart: dc.rowChart("#topdonors_chart"),
    type: 'row',
    divId: 'topdonors_chart'
  },
  topOwners: {
    chart: dc.rowChart("#topowners_chart"),
    type: 'row',
    divId: 'topowners_chart'
  },
  flags: {
    chart: dc.rowChart("#flags_chart"),
    type: 'row',
    divId: 'flags_chart'
  },
  table: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function() {
  //Replace element if with wordcloud column id
  var width = document.getElementById("wordcloud_chart_col").offsetWidth - vuedata.chartMargin*2;
  return [width, 410];
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if(charts[c].type == 'row'){
      charts[c].chart.width(newWidth);
      charts[c].chart.label(function (d) {
        var thisKey = d.key;
        if(thisKey.indexOf('###') > -1){
          thisKey = thisKey.split('###')[0];
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      })
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
          var thisKey = d.name;
          if(thisKey == 'Others') { thisKey = 'Muud'; }
          if(thisKey.length > 40){
            return thisKey.substring(0,40) + '...';
          }
          return thisKey;
        }));
        //.legend(dc.legend().x(0).y(sizes.legendY).gap(10));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.size(recalcWidthWordcloud());
      charts[c].chart.redraw();
    }
  }
};

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}

//Custom date order for dataTables
//var dmy = d3.timeParse("%d/%m/%Y");
var dmy = d3.timeParse("%Y-%m-%d");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
      return dmy(date);
  },
  "date-eu-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Custom ordering for flag images
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "flags-pre": function (a) {
    var flagsCount = a.split('.png').length - 1;
    return parseFloat(flagsCount);
  },
  "flags-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "flags-desc": function (a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)
var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

json('./data/leanCompanies.json?' + randomPar, (err, companies) => {
  //Parse data
  _.each(companies, function (d) {
    if(!d.contractorInNotices) { 
      d.contractorInNotices = 0;
    }
    if(!d.contractingBodyInNotices) { 
      d.contractingBodyInNotices = 0;
    }
    if(!d.flags) {
      d.flags = 0;
    }
    //Beneficial owners list
    d.boList = [];
    _.each(d.beneficial_owners_info, function (bo) {
      d.boList.push(bo.eesnimi + ' ' + bo.nimi);
    });
    //Beneficial owners range
    d.boRange = 'N/A';
    if(d.beneficial_owners || d.beneficial_owners == 0) {
      if(d.beneficial_owners == 0) {
        d.boRange = '0';
      } else if(d.beneficial_owners < 3) {
        d.boRange = '1 - 2';
      } else if(d.beneficial_owners < 6) {
        d.boRange = '3 - 5';
      } else if(d.beneficial_owners < 11) {
        d.boRange = '6 - 10';
      } else {
        d.boRange = '> 10';
      }
    }
    //Donations range
    d.donationsRange = 0;
    if(d.political_donations_tot == 0) {
      d.donationsRange = '0';
    } else if(d.political_donations_tot < 1000) {
      d.donationsRange = '1 - 1k';
    } else if(d.political_donations_tot < 10000) {
      d.donationsRange = '1k - 10k';
    } else if(d.political_donations_tot < 100000) {
      d.donationsRange = '10k - 100k';
    } else {
      d.donationsRange = '> 100k';
    }
    //Country
    if(!d.country) {
      if(d.inRegistry) { 
        d.country = 'EE' 
      } else {
        d.country = 'N/A'; 
      }
    }
    //Flags translations
    d.flagsTranslated = [];
    _.each(d.flags, function (f) {
      d.flagsTranslated.push(vuedata.flagsTranslations[f]);
    });
    d.flags = d.flagsTranslated;
  });

  //Set dc main vars
  var ndx = crossfilter(companies);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = '' + d.name;
      return entryString.toLowerCase();
  });

  //CHART 1 - Flags
  var createFlagsChart = function() {
    var chart = charts.flags.chart;
    var dimension = ndx.dimension(function (d) {
        return d.flags;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.flags.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(460)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.flags;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 1 - Top contracting bodies
  var createTopContractorsChart = function() {
    var chart = charts.topContractors.chart;
    var dimension = ndx.dimension(function (d) {
        return d.name;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.contractorInNotices;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topContractors.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(460)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 2 - Top contracting bodies
  var createTopContractingChart = function() {
    var chart = charts.topContracting.chart;
    var dimension = ndx.dimension(function (d) {
        return d.name;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return d.contractingBodyInNotices;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topContracting.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(460)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 3 - Number of beneficial owners
  var createBeneficiariesChart = function() {
    var chart = charts.beneficialOwners.chart;
    var dimension = ndx.dimension(function (d) {
      return d.boRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.beneficialOwners.divId);
    var order = ["N/A", "0", "1 - 2", "3 - 5", "6 - 10", "> 10"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .ordering(function(d) { return order.indexOf(d.key)})
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .group(group)
      .colorCalculator(function(d, i) {
        if(d.key == "Others" || d.key == "N/A") {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      });
    chart.render();
  }

  /*
  //CHART 2 - Top countries
  var createCountryChart  = function() {
    var chart = charts.country.chart;
    var dimension = ndx.dimension(function (d) {
        return d.country;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.country.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(460)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }
  */

  //CHART 4 - Countries
  var createCountryChart = function() {
    var chart = charts.country.chart;
    var dimension = ndx.dimension(function (d) {
      return d.country;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.country.divId);
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .cap(4)
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey == 'Others') { thisKey = 'Muud'; }
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        if(d.key == 'Others') { d.key = 'Muud'; }
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .group(group)
      .colorCalculator(function(d, i) {
        if(d.key == "Others" || d.key == "N/A" || d.key == "Muud") {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      });
    chart.render();
  }

  //CHART 5 - Donations range
  var createDonationsChart = function() {
    var chart = charts.donations.chart;
    var dimension = ndx.dimension(function (d) {
      return d.donationsRange;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.donations.divId);
    var order = ["N/A", "0", "1 - 1k", "1k - 10k", "10k - 100k", "> 100k"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .ordering(function(d) { return order.indexOf(d.key)})
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .group(group)
      .colorCalculator(function(d, i) {
        if(d.key == "Others" || d.key == "N/A" || d.key == 0) {
          return "#ddd";
        }
        return vuedata.colors.range[i];
      });
    chart.render();
  }

  //CHART 6 - Top donors
  var createTopDonorsChart = function() {
    var chart = charts.topDonors.chart;
    var dimension = ndx.dimension(function (d) {
        return d.name;
    }, false);
    var group = dimension.group().reduceSum(function (d) {
        if(d.name == 'Siseministeerium' || d.name == 'Rahandusministeerium') {
           return 0;
        }
        return d.political_donations_tot;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return d.value !== 0;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topDonors.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(460)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 7 - Top owners
  var createTopOwnersChart = function() {
    var chart = charts.topOwners.chart;
    var dimension = ndx.dimension(function (d) {
        return d.boList;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
        return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(15).filter(function(d) {
            return true;
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topOwners.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(460)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + d.value;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //TABLE
  var createTable = function() {
    var count=0;
    charts.table.chart = $("#dc-data-table").dataTable({
      "language": {
        "info": "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
        "lengthMenu": "Näita _MENU_ tulemust",
        "paginate": {
          "next":       "Järgmine",
          "previous":   "Eelmine"
        }
      },
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.name;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.beneficial_owners;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.contractorInNotices;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.contractingBodyInNotices;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "type": "flags",
          "className": "dt-body-center",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            if(d.flags.length == 0) {
              return '/';
            }
            var flagsOutput = "";
            for (let i = 0; i < d.flags.length; i++) {
              flagsOutput += "<img src='./images/redflag.png' class='redflag-img'>";
            }
            return flagsOutput;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 3, "desc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.table.chart;
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
        datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
        });
      });
      datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
      vuedata.modalShowTable = 'a';
      if(data.inRegistry) {
        json('./data/company_notices/'+data.id+'.json', (err, orgNotices) => {
          data.orgNotices = orgNotices;
          _.each(data.orgNotices, function (n) {
            n.contracting_bodies_ids = [];
            _.each(n.contracting_bodies, function (cb) {
              n.contracting_bodies_ids.push(cb.id);
            });
          });
          vuedata.selectedEl = data;
          $('#detailsModal').modal();
          InitializeDonationsModalTable()
          var dTable = $("#modalTendersTable");
          dTable.DataTable ({
            "data" : vuedata.selectedEl.orgNotices,
            "destroy": true,
            "search": true,
            "pageLength": 10,
            "dom": '<<f><t>pi>',
            "order": [[ 0, "desc" ]],
            "language": {
              "info": "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
              "lengthMenu": "Näita _MENU_ tulemust",
              "search": "Otsi",
              "paginate": {
                "next":       "Järgmine",
                "previous":   "Eelmine"
              }
            },
            "columns" : [
              { "data" : function(a) { 
                  if(a.contract_title) { 
                    if(a.refnum) { return a.contract_title + ' (' + a.refnum + ')';  }
                    return a.contract_title; 
                  }
                  return "N/A";
                }
              },
              { "type": "date-custom",
                "data" : function(a) { 
                  if(a.date_dispatch_notice) { return a.date_dispatch_notice; }
                  return "N/A";
                }
              },
              { "data" : function(a) { 
                  if(a.contract_type) { 
                    if(vuedata.categoriesTranslations[a.contract_type]) { return vuedata.categoriesTranslations[a.contract_type]; }
                    return a.contract_type; 
                  }
                  return "N/A";
                } 
              },
              /*
              { "data" : function(a) { 
                if(a.contracting_body_name) { return a.contracting_body_name; }
                return "N/A";
                }
              },
              */
              { "data" : function(a) { 
                if(a.contracting_bodies_ids.indexOf(vuedata.selectedEl.id) > -1) { return "hankija"; }
                //if(a.contracting_body_id == vuedata.selectedEl.id) { return "hankija"; }
                return "töövõtja";
                }
              } 
            ]
          });
        });
      } else {
        vuedata.selectedEl = data;
        $('#detailsModal').modal();
        InitializeDonationsModalTable();
      }
    });
  }

  function InitializeDonationsModalTable() {
    var dTable = $("#modalTendersTableDonations");
      dTable.DataTable ({
        "data" : vuedata.selectedEl.political_donations,
        "destroy": true,
        "search": true,
        "pageLength": 10,
        "dom": '<<t>pi>',
        "order": [[ 0, "desc" ]],
        "language": {
          "info": "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
          "lengthMenu": "Näita _MENU_ tulemust",
          "paginate": {
            "next":       "Järgmine",
            "previous":   "Eelmine"
          }
        },
        "columns" : [
          { "data" : function(a) { 
              if(a.payer) { return a.payer; }
              return "N/A";
            }
          },
          { "type": "date-custom",
            "data" : function(a) { 
              if(a.party) { return a.party; }
              return "N/A";
            }
          },
          { "data" : function(a) { 
              if(a.amount) { return a.amount; }
              return "N/A";
            } 
          },
          { "data" : function(a) { 
            if(a.date) { return a.date; }
            return "N/A";
            }
          },
          { "data" : function(a) { 
            if(a.revenue_category) { return a.revenue_category; }
            return "N/A";
            }
          }
        ]
      });
  }

  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.table.chart.fnClearTable();
      charts.table.chart.fnAddData(alldata);
      charts.table.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Set word for wordcloud
  var setword = function(wd) {
    //console.log(charts.subject.chart);
    $("#search-input").val(wd);
    var s = wd.toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
        console.log ("redraw");
          dc.redrawAll();
      }, 250);
    }
  }

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createFlagsChart();
  createTopContractorsChart();
  createTopContractingChart();
  createBeneficiariesChart();
  createCountryChart();
  createDonationsChart();
  createTopDonorsChart();
  createTopOwnersChart();
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };

});
