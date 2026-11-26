import jquery from "jquery";
window.jQuery = jquery;
window.$ = jquery;
require("jquery-ui-bundle");
require("jquery-ui-bundle/jquery-ui.css");
require("datatables.net")(window, $);
require("datatables.net-dt")(window, $);

import underscore from "underscore";
window.underscore = underscore;
window._ = underscore;

import "../public/vendor/js/popper.min.js";
import "../public/vendor/js/bootstrap.min.js";
import { csv } from "d3-request";
import { json } from "d3-request";

import "../public/vendor/css/bootstrap.min.css";
import "../public/vendor/css/dc.css";
import "/scss/main.scss";

import Vue from "vue";
import Loader from "./components/Loader.vue";
import ChartHeader from "./components/ChartHeader.vue";

// Data object - is also used by Vue

var vuedata = {
  page: "notices",
  loader: true,
  showInfo: true,
  showShare: true,
  modalShowTable: "a",
  years: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  selectedYear: 2026,
  chartMargin: 40,
  cpvList: [],
  flagsTranslations: {
    "Too few evaluation criteria": "Liiga vähe hindamiskriteeriumeid",
    "Nominees as company board members or beneficial owners":
      "Variomanik(ud) nõukogu liikme või tegeliku kasusaajana",
    "Possible shell company": "Võimalik riiulifirma",
    "Tenders received low": "Vähe pakkumusi",
    "Tenders received info missing": "Pakkumuste info puudulik",
    "Short notice period": "Lühike pakkumuste esitamise tähtaeg",
    "Seller is a large political donor": "Pakkuja on suur poliitiline annetaja",
    "Term of contract (long or indefinite)": "Pikk või tähtajatu leping",
    "Special purpose company": "Uus firma",
    "Succesful procedure without contracting": "Edukas hange ilma lepinguta",
  },
  docTypeTranslations: {
    award: "leping",
    notice: "hange",
  },
  categoriesTranslations: {
    SERVICES: "teenused",
    SUPPLIES: "asjad",
    WORKS: "ehitustööd",
    "N/A": "ei kehti",
  },
  charts: {
    typeDoc: {
      title: "Teate liik",
      info: "Siit saab filtreerida teate liigi järgi - kas hanketeateid, lepinguid või mõlemaid.",
    },
    type: {
      title: "Hangete kategooriad",
      info: "Siit saab filtreerida hanke kategooria järgi - teenuseid, asju ja/või ehitustöid.",
    },
    contractingBodies: {
      title: "TOP hankijad",
      info: "TOP15 hankijat hanketeadete arvu järgi",
    },
    contractors: {
      title: "TOP pakkujad",
      info: "TOP15 pakkujat hanketeadete arvu järgi",
    },
    cpv: {
      title: "TOP CPV",
      info: "TOP15 tegevusvaldkonda CPV e ühtse riigihangete klassifikaatori koodi järgi",
    },
    flags: {
      title: "Riskid",
      info: "Riskinäitajad, mis võivad osutada puudulikule hankeprotsessile, ebakohasele mõjule, korruptsiooniohule või huvide konfliktile.",
    },
    cloud: {
      title: "Nimetuste sõnapilv",
      info: "Siin kuvatakse hanke nimetustes kõige sagedamini esinevaid sõnu - mida suuremalt sõna on kuvatud, seda sagedamini seda sõna esineb.",
    },
    table: {
      chart: null,
      type: "table",
      title: "Teated",
      info: "Järjestatavas tabelis on esitatud kõik hanke- ja lepinguteated, mis valitud aktiivsetele filtritele vastavad.",
    },
  },
  selectedEl: { Name: "" },
  colors: {
    default: "#00A2AB",
    flags: "#f22241",
    range: [
      "#62aad9",
      "#00A2AB",
      "#1a6da3",
      "#085c9c",
      "#e3b419",
      "#e39219",
      "#de7010",
    ],
    rangeVarious: ["#00A2AB", "#F29222", "#64B45A", "#cccccc"],
    colorSchemeCloud: [
      "#00A2AB",
      "#33B5BC",
      "#007b82",
      "#64B45A",
      "#7dc773",
      "#F29222",
    ],
    sunburst: {
      Notice: {
        Flagged: "#f22241",
        "No flags": "#72b9e8",
        base: "#00A2AB",
      },
      "Award notice": {
        Flagged: "#bf341b",
        "No flags": "#ffe566",
        base: "#ebcc34",
      },
    },
    //colorSchemeCloud: ["#62aad9", "#3b95d0", "#b7bebf", "#1a6da3", "#e3b419", "#e39219", "#de7010"]
  },
};

//Set vue components and Vue app

Vue.component("chart-header", ChartHeader);
Vue.component("loader", Loader);

new Vue({
  el: "#app",
  data: vuedata,
  methods: {
    //Share
    share: function (platform) {
      if (platform == "twitter") {
        var thisPage = window.location.href.split("?")[0];
        var shareText = "Ausa Riigi Valvur " + thisPage;
        var shareURL =
          "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(shareText);
        window.open(shareURL, "_blank");
        return;
      }
      if (platform == "facebook") {
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = "https://ausriik.ee";
        var shareURL =
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(toShareUrl);
        window.open(
          shareURL,
          "_blank",
          "toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300",
        );
        return;
      }
    },
  },
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover();
});

//Charts
var charts = {
  typeDoc: {
    chart: dc.pieChart("#typedoc_chart"),
    //chart: dc.sunburstChart("#typedoc_chart"),
    type: "pie",
    divId: "typedoc_chart",
  },
  type: {
    chart: dc.pieChart("#type_chart"),
    type: "pie",
    divId: "type_chart",
  },
  contractingBodies: {
    chart: dc.rowChart("#contractingbodies_chart"),
    type: "row",
    divId: "contractingbodies_chart",
  },
  contractors: {
    chart: dc.rowChart("#contractors_chart"),
    type: "row",
    divId: "contractors_chart",
  },
  cpv: {
    chart: dc.rowChart("#cpv_chart"),
    type: "row",
    divId: "cpv_chart",
  },
  flags: {
    chart: dc.rowChart("#flags_chart"),
    type: "row",
    divId: "flags_chart",
  },
  cloud: {
    chart: dc.wordCloud("#cloud_chart"),
    type: "cloud",
    divId: "cloud_chart",
  },
  table: {
    chart: null,
    type: "table",
    divId: "dc-data-table",
  },
};

//Functions for responsivness
var recalcWidth = function (divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcWidthWordcloud = function () {
  //Replace element if with wordcloud column id
  var width =
    document.getElementById("wordcloud_chart_col").offsetWidth -
    vuedata.chartMargin * 2;
  return [width, 410];
};
var recalcCharsLength = function (width) {
  return parseInt(width / 8);
};
var calcPieSize = function (divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    width: newWidth,
    height: 0,
    radius: 0,
    innerRadius: 0,
    cy: 0,
    legendY: 0,
  };
  if (newWidth < 300) {
    sizes.height = newWidth + 170;
    sizes.radius = newWidth / 2;
    sizes.innerRadius = newWidth / 4;
    sizes.cy = newWidth / 2;
    sizes.legendY = newWidth + 30;
  } else {
    sizes.height = newWidth * 0.75 + 170;
    sizes.radius = (newWidth * 0.75) / 2;
    sizes.innerRadius = (newWidth * 0.75) / 4;
    sizes.cy = (newWidth * 0.75) / 2;
    sizes.legendY = newWidth * 0.75 + 30;
  }
  return sizes;
};
var resizeGraphs = function () {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if (charts[c].type == "row") {
      charts[c].chart.width(newWidth);
      charts[c].chart.label(function (d) {
        var thisKey = d.key;
        if (thisKey.indexOf("###") > -1) {
          thisKey = thisKey.split("###")[0];
        }
        if (thisKey.length > charsLength) {
          return thisKey.substring(0, charsLength) + "...";
        }
        return thisKey;
      });
      charts[c].chart.redraw();
    } else if (charts[c].type == "bar") {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if (charts[c].type == "pie") {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(
          dc
            .legend()
            .x(0)
            .y(sizes.legendY)
            .gap(10)
            .autoItemWidth(true)
            .horizontal(false)
            .legendWidth(sizes.width),
        );
      //.legend(dc.legend().x(0).y(sizes.legendY).gap(10));
      charts[c].chart.redraw();
    } else if (charts[c].type == "cloud") {
      charts[c].chart.size(recalcWidthWordcloud());
      charts[c].chart.redraw();
    }
  }
};

//Add commas to thousands
function addcommas(x) {
  if (parseInt(x)) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return x;
}

//Custom date order for dataTables
//var dmy = d3.timeParse("%d/%m/%Y");
var dmy = d3.timeParse("%Y-%m-%d");
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    return dmy(date);
  },
  "date-eu-asc": function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  },
  "date-eu-desc": function (a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  },
});

//Custom ordering for flag images
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "flags-pre": function (a) {
    var flagsCount = a.split(".png").length - 1;
    return parseFloat(flagsCount);
  },
  "flags-asc": function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  },
  "flags-desc": function (a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  },
});

//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var urlYear = getParameterByName("y");
if (urlYear && vuedata.years.indexOf(urlYear) > -1) {
  vuedata.selectedYear = urlYear;
} else {
  vuedata.selectedYear = 2026;
}

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)
var randomPar = "";
var randomCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for (var i = 0; i < 5; i++) {
  randomPar += randomCharacters.charAt(
    Math.floor(Math.random() * randomCharacters.length),
  );
}

json("./data/notices_" + vuedata.selectedYear + ".json?" + randomPar, (err, notices) => {
  json("./data/CPV_codes.json?" + randomPar, (err, cpvCodes) => {
    //Parse data
    _.each(notices, function (d) {
      d.cpvString = "N/A";
      if (d.cpv && cpvCodes[d.cpv]) {
        d.cpvString = cpvCodes[d.cpv].EE;
      } else {
        d.cpvString = d.cpv;
      }
      d.cpvStringFull = d.cpvString + " (" + d.cpv + ")";
      //Add to cpvList
      if (vuedata.cpvList.indexOf(d.cpvStringFull) == -1) {
        vuedata.cpvList.push(d.cpvStringFull);
      }
      d.contractorsList = [];
      if (d.award_items) {
        _.each(d.award_items, function (a) {
          if (a.contractors) {
            _.each(a.contractors, function (c) {
              d.contractorsList.push(c.contractor_name);
            });
          }
        });
      }
      //Contracting bodies names list
      d.contractingBodiesNames = [];
      d.contractingBodiesList = [];
      d.contractingBodiesString = "";
      if (d.contracting_bodies) {
        _.each(d.contracting_bodies, function (a) {
          d.contractingBodiesNames.push(a.name);
          d.contractingBodiesList.push(a.name + " (" + a.id + ")");
        });
      }
      d.contractingBodiesString = d.contractingBodiesList.join(" | ");
      //Flags translations
      d.flagsTranslated = [];
      _.each(d.flags, function (f) {
        d.flagsTranslated.push(vuedata.flagsTranslations[f]);
      });
      d.flags = d.flagsTranslated;
      if (!d.contract_type) {
        d.contract_type = "N/A";
      }
      if (vuedata.categoriesTranslations[d.contract_type]) {
        d.contract_type = vuedata.categoriesTranslations[d.contract_type];
      }
    });
    vuedata.cpvList.sort();
    console.log(vuedata.cpvList);

    //Set dc main vars
    var ndx = crossfilter(notices);
    var searchDimension = ndx.dimension(function (d) {
      var entryString =
        "" +
        d.contract_title +
        " " +
        d.contracting_body_name +
        " " +
        d.contractorsList.join(" ");
      return entryString.toLowerCase();
    });
    var parseDate = d3.timeParse("%Y-%m-%d");
    var dateDimension = ndx.dimension(function (d) {
      if (!d.date_dispatch_notice) {
        return "";
      }
      return parseDate(d.date_dispatch_notice);
    });
    var cpvDimension = ndx.dimension(function (d) {
      return d.cpvStringFull;
    });

    //CHART 1 - Doc Types
    var createTypeDocChart = function () {
      var chart = charts.typeDoc.chart;
      var dimension = ndx.dimension(function (d) {
        if (!d.docType) {
          return "N/A";
        }
        return vuedata.docTypeTranslations[d.docType];
      });
      var group = dimension.group().reduceSum(function (d) {
        return 1;
      });
      var sizes = calcPieSize(charts.typeDoc.divId);
      chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .cap(7)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(
          dc
            .legend()
            .x(0)
            .y(sizes.legendY)
            .gap(10)
            .autoItemWidth(true)
            .horizontal(false)
            .legendWidth(sizes.width)
            .legendText(function (d) {
              var thisKey = d.name;
              if (thisKey.length > 40) {
                return thisKey.substring(0, 40) + "...";
              }
              return thisKey;
            }),
        )
        .title(function (d) {
          var thisKey = d.key;
          return thisKey + ": " + d.value;
        })
        .dimension(dimension)
        //.ordinalColors(vuedata.colors.range)
        .colorCalculator(function (d, i) {
          if (d.key == "Others" || d.key == "N/A") {
            return "#ddd";
          }
          return vuedata.colors.rangeVarious[i];
        })
        .group(group);
      chart.render();
    };

    //CHART 2 - Types
    var createTypeChart = function () {
      var chart = charts.type.chart;
      var dimension = ndx.dimension(function (d) {
        return d.contract_type;
      });
      var group = dimension.group().reduceSum(function (d) {
        return 1;
      });
      var sizes = calcPieSize(charts.type.divId);
      chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .cap(7)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(
          dc
            .legend()
            .x(0)
            .y(sizes.legendY)
            .gap(10)
            .autoItemWidth(true)
            .horizontal(false)
            .legendWidth(sizes.width)
            .legendText(function (d) {
              var thisKey = d.name;
              if (thisKey.length > 40) {
                return thisKey.substring(0, 40) + "...";
              }
              return thisKey;
            }),
        )
        .title(function (d) {
          var thisKey = d.key;
          return thisKey + ": " + d.value;
        })
        .dimension(dimension)
        //.ordinalColors(vuedata.colors.range)
        .colorCalculator(function (d, i) {
          if (d.key == "Others" || d.key == "N/A") {
            return "#ddd";
          }
          return vuedata.colors.rangeVarious[i];
        })
        .group(group);

      chart.render();
    };

    //CHART 3 - Top contracting bodies
    var createContractingBodiesChart = function () {
      var chart = charts.contractingBodies.chart;
      var dimension = ndx.dimension(function (d) {
        //return d.decident_institution_streamlined_refined;
        return d.contractingBodiesNames;
      }, true);
      var group = dimension.group().reduceSum(function (d) {
        return 1;
      });
      var filteredGroup = (function (source_group) {
        return {
          all: function () {
            return source_group.top(15).filter(function (d) {
              return true;
            });
          },
        };
      })(group);
      var width = recalcWidth(charts.contractingBodies.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(460)
        .margins({ top: 0, left: 0, right: 0, bottom: 20 })
        .group(filteredGroup)
        .dimension(dimension)
        .colorCalculator(function (d, i) {
          return vuedata.colors.default;
        })
        .label(function (d) {
          if (d.key.length > charsLength) {
            return d.key.substring(0, charsLength) + "...";
          }
          return d.key;
        })
        .title(function (d) {
          return d.key + ": " + d.value;
        })
        .elasticX(true)
        .xAxis()
        .ticks(4);
      chart.render();
    };

    //CHART 4 - Top contractors
    var createContractorsChart = function () {
      var chart = charts.contractors.chart;
      var dimension = ndx.dimension(function (d) {
        //return d.decident_institution_streamlined_refined;
        return d.contractorsList;
      }, true);
      var group = dimension.group().reduceSum(function (d) {
        return 1;
      });
      var filteredGroup = (function (source_group) {
        return {
          all: function () {
            return source_group.top(15).filter(function (d) {
              return true;
            });
          },
        };
      })(group);
      var width = recalcWidth(charts.contractors.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(460)
        .margins({ top: 0, left: 0, right: 0, bottom: 20 })
        .group(filteredGroup)
        .dimension(dimension)
        .colorCalculator(function (d, i) {
          return vuedata.colors.default;
        })
        .label(function (d) {
          if (d.key.length > charsLength) {
            return d.key.substring(0, charsLength) + "...";
          }
          return d.key;
        })
        .title(function (d) {
          return d.key + ": " + d.value;
        })
        .elasticX(true)
        .xAxis()
        .ticks(4);
      chart.render();
    };

    //CHART 5 - Cloud
    var createCloudChart = function () {
      var chart = charts.cloud.chart;
      var dimension = ndx.dimension(function (d) {
        return d.contract_title || "";
      });
      var group = dimension.group().reduceSum(function (d) {
        return 1;
      });
      chart
        .dimension(dimension)
        .group(group)
        .rotate(function () {
          return ~~(Math.random() * 2) * 90;
        })
        .maxWords(110)
        .scale(d3.scaleLinear().domain([5, 100]).range([14, 25]))
        .timeInterval(10)
        .duration(200)
        .ordinalColors(vuedata.colors.colorSchemeCloud)
        .size(recalcWidthWordcloud())
        .font("Barlow Condensed")
        .fontWeight("600")
        .padding("1")
        .stopWords(
          /^(nr|1|2|3|4|5|6|7|8|9|10|11|for|aj|II|II|ii|–|III|III|iii|kv|of|I|I|i|tn|as|ost|mnt|Eesti|eesti|and|km|osa|tee|küla|valla| küla|vald| vald|ja|aga|ei|et|ja|jah|kas|kui|kõik|ma|me|mida|mind|minu|mu|mul|mulle|nad|nii|olen|oli|oma|on|pole|saseda|see|selle|siin|siis|ta|te|ära|ostmine|ning|tellimine|teenuse|teenus|koostamine|asuva|koos|etapp|etapi|sh|hanke|projekt|projekti)$/,
        )
        .onClick(function (d) {
          setword(d.key);
        })
        .textAccessor(function (d) {
          return d.contract_title;
        });
      chart.size(recalcWidthWordcloud());
      chart.render();
    };

    //CHART 6 - Top CPV
    var createCpvChart = function () {
      var chart = charts.cpv.chart;
      var dimension = ndx.dimension(function (d) {
        return d.cpvString + " (" + d.cpv + ")";
      }, false);
      var group = dimension.group().reduceSum(function (d) {
        return 1;
      });
      var filteredGroup = (function (source_group) {
        return {
          all: function () {
            return source_group.top(15).filter(function (d) {
              return true;
            });
          },
        };
      })(group);
      var width = recalcWidth(charts.cpv.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(420)
        .margins({ top: 0, left: 0, right: 0, bottom: 20 })
        .group(filteredGroup)
        .dimension(dimension)
        .colorCalculator(function (d, i) {
          return vuedata.colors.default;
        })
        .label(function (d) {
          if (d.key.length > charsLength) {
            return d.key.substring(0, charsLength) + "...";
          }
          return d.key;
        })
        .title(function (d) {
          return d.key + ": " + d.value;
        })
        .elasticX(true)
        .xAxis()
        .ticks(4);
      chart.render();
    };

    //CHART 7 - Flags
    var createFlagsChart = function () {
      var chart = charts.flags.chart;
      var dimension = ndx.dimension(function (d) {
        return d.flags;
      }, true);
      var group = dimension.group().reduceSum(function (d) {
        return 1;
      });
      var filteredGroup = (function (source_group) {
        return {
          all: function () {
            return source_group.top(15).filter(function (d) {
              return true;
            });
          },
        };
      })(group);
      var width = recalcWidth(charts.flags.divId);
      var charsLength = recalcCharsLength(width);
      chart
        .width(width)
        .height(460)
        .margins({ top: 0, left: 0, right: 0, bottom: 20 })
        .group(filteredGroup)
        .dimension(dimension)
        .colorCalculator(function (d, i) {
          return vuedata.colors.flags;
        })
        .label(function (d) {
          if (d.key.length > charsLength) {
            return d.key.substring(0, charsLength) + "...";
          }
          return d.key;
        })
        .title(function (d) {
          return d.key + ": " + d.value;
        })
        .elasticX(true)
        .xAxis()
        .ticks(4);
      chart.render();
    };

    //TABLE
    var createTable = function () {
      var count = 0;
      charts.table.chart = $("#dc-data-table").dataTable({
        language: {
          info: "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
          lengthMenu: "Näita _MENU_ tulemust",
          paginate: {
            next: "Järgmine",
            previous: "Eelmine",
          },
        },
        columnDefs: [
          {
            searchable: false,
            orderable: false,
            targets: 0,
            data: function (row, type, val, meta) {
              return count;
            },
          },
          {
            searchable: false,
            orderable: true,
            targets: 1,
            defaultContent: "N/A",
            data: function (d) {
              if (d.refnum) {
                return d.contract_title + " (" + d.refnum + ")";
              }
              return d.contract_title;
            },
          },
          {
            searchable: false,
            orderable: true,
            targets: 2,
            defaultContent: "N/A",
            data: function (d) {
              if (d.changes_doc) {
                return vuedata.docTypeTranslations[d.docType] + " (parandus)";
              } else if (d.modifications_contract) {
                return vuedata.docTypeTranslations[d.docType] + " (muudatus)";
              }
              return vuedata.docTypeTranslations[d.docType];
            },
          },
          {
            searchable: false,
            orderable: true,
            targets: 3,
            defaultContent: "N/A",
            type: "date-eu",
            data: function (d) {
              return d.date_dispatch_notice;
            },
          },
          {
            searchable: false,
            orderable: true,
            targets: 4,
            defaultContent: "N/A",
            data: function (d) {
              if (d.contracting_bodies && d.contracting_bodies.length > 0) {
                return d.contracting_bodies[0].name;
              }
            },
          },
          {
            searchable: false,
            orderable: true,
            targets: 5,
            defaultContent: "N/A",
            data: function (d) {
              return d.contract_type;
            },
          },
          {
            searchable: false,
            orderable: true,
            targets: 6,
            defaultContent: "N/A",
            type: "flags",
            className: "dt-body-center",
            orderSequence: ["desc", "asc"],
            data: function (d) {
              if (!d.flags || d.flags.length == 0) {
                return "/";
              }
              var flagsOutput = "";
              for (let i = 0; i < d.flags.length; i++) {
                flagsOutput +=
                  "<img src='./images/redflag.png' class='redflag-img'>";
              }
              return flagsOutput;
            },
          },
        ],
        iDisplayLength: 25,
        bPaginate: true,
        bLengthChange: true,
        bFilter: false,
        order: [[3, "desc"]],
        bSort: true,
        bInfo: true,
        bAutoWidth: false,
        bDeferRender: true,
        aaData: searchDimension.top(Infinity),
        bDestroy: true,
      });
      var datatable = charts.table.chart;
      datatable.on("draw.dt", function () {
        var PageInfo = $("#dc-data-table").DataTable().page.info();
        datatable
          .DataTable()
          .column(0, { page: "current" })
          .nodes()
          .each(function (cell, i) {
            cell.innerHTML = i + 1 + PageInfo.start;
          });
      });
      datatable.DataTable().draw();

      $("#dc-data-table tbody").on("click", "tr", function () {
        var data = datatable.DataTable().row(this).data();
        vuedata.modalShowTable = "a";
        json(
          "./data/linked_docs/" + data.noticeUid + ".json",
          (err, linkedDocs) => {
            data.linkedDocs = linkedDocs.filter(function (d) {
              return d.filename !== data.filename;
            });
            vuedata.selectedEl = data;
            $("#detailsModal").modal();
            //Network chart
            //createNetworkGraph("./data/network_data/docs/81d06b5c-cf96-4920-81f9-b6671932ae05.json");
            setTimeout(function () {
              createNetworkGraph(data.noticeUid + ".json");
            }, 1);

            //Contracting bodies table
            var dTableChanges = $("#modalTendersTableContracting");
            dTableChanges.DataTable({
              data: vuedata.selectedEl.contracting_bodies,
              destroy: true,
              search: true,
              pageLength: 10,
              dom: "<<><t>pi>",
              order: [[0, "desc"]],
              language: {
                info: "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
                lengthMenu: "Näita _MENU_ tulemust",
                paginate: {
                  next: "Järgmine",
                  previous: "Eelmine",
                },
              },
              columns: [
                {
                  data: function (a) {
                    if (a.id) {
                      return a.id;
                    }
                    return "N/A";
                  },
                },
                {
                  type: "date-custom",
                  data: function (a) {
                    if (a.name) {
                      return a.name;
                    }
                    return "N/A";
                  },
                },
                {
                  data: function (a) {
                    if (a.town) {
                      return a.town;
                    }
                    return "N/A";
                  },
                },
              ],
            });
            //Contract items table
            var dTableItems = $("#modalTendersTableItems");
            dTableItems.DataTable({
              data: vuedata.selectedEl.award_items,
              destroy: true,
              search: true,
              pageLength: 10,
              dom: "<<><t>pi>",
              order: [[0, "desc"]],
              language: {
                info: "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
                lengthMenu: "Näita _MENU_ tulemust",
                paginate: {
                  next: "Järgmine",
                  previous: "Eelmine",
                },
              },
              columns: [
                {
                  data: function (a) {
                    if (a.contract_awarded) {
                      if (a.contract_awarded == true) {
                        return "jah";
                      }
                      return a.contract_awarded;
                    }
                    return "N/A";
                  },
                },
                {
                  type: "date-custom",
                  data: function (a) {
                    if (a.award_date_conclusion_contract) {
                      return a.award_date_conclusion_contract;
                    }
                    return "N/A";
                  },
                },
                {
                  data: function (a) {
                    if (a.award_value) {
                      return a.award_value + " " + a.award_value_curr;
                    }
                    return "N/A";
                  },
                },
                {
                  data: function (a) {
                    if (a.contractors) {
                      var cNames = [];
                      _.each(a.contractors, function (c) {
                        cNames.push(c.contractor_name);
                      });
                      return cNames.join(", ");
                    }
                    return "N/A";
                  },
                },
              ],
            });
            //Changes table
            var dTableChanges = $("#modalTendersTableChanges");
            dTableChanges.DataTable({
              data: vuedata.selectedEl.changes,
              destroy: true,
              search: true,
              pageLength: 10,
              dom: "<<><t>pi>",
              order: [[0, "desc"]],
              language: {
                info: "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
                lengthMenu: "Näita _MENU_ tulemust",
                paginate: {
                  next: "Järgmine",
                  previous: "Eelmine",
                },
              },
              columns: [
                {
                  data: function (a) {
                    if (a.old) {
                      return a.old;
                    }
                    return "N/A";
                  },
                },
                {
                  type: "date-custom",
                  data: function (a) {
                    if (a.new) {
                      return a.new;
                    }
                    return "N/A";
                  },
                },
                {
                  data: function (a) {
                    if (a.where) {
                      return a.where;
                    }
                    return "N/A";
                  },
                },
              ],
            });
            //Linked docs table
            var dTable = $("#modalTendersTable");
            dTable.DataTable({
              data: vuedata.selectedEl.linkedDocs,
              destroy: true,
              search: true,
              pageLength: 10,
              dom: "<<><t>pi>",
              order: [[0, "desc"]],
              language: {
                info: "Kuvatakse _START_ kuni _END_  _TOTAL_-st tulemusest",
                lengthMenu: "Näita _MENU_ tulemust",
                paginate: {
                  next: "Järgmine",
                  previous: "Eelmine",
                },
              },
              columns: [
                {
                  data: function (a) {
                    if (a.contract_title) {
                      return a.contract_title;
                    }
                    return "N/A";
                  },
                },
                {
                  type: "date-custom",
                  data: function (a) {
                    if (a.date_dispatch_notice) {
                      return a.date_dispatch_notice;
                    }
                    return "N/A";
                  },
                },
                {
                  data: function (a) {
                    if (a.contract_type) {
                      return vuedata.categoriesTranslations[a.contract_type];
                    }
                    return "N/A";
                  },
                },
                {
                  data: function (a) {
                    if (a.contracting_bodies) {
                      var cbString = [];
                      _.each(a.contracting_bodies, function (cb) {
                        cbString.push(cb.name);
                      });
                      return cbString.join(", ");
                    }
                    return "N/A";
                  },
                },
                {
                  data: function (a) {
                    return a.flags.length;
                  },
                },
              ],
            });
          },
        );
      });
    };
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
    $input.on("keyup", function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });
    $input.on("keydown", function () {
      clearTimeout(typingTimer);
    });
    function doneTyping() {
      var s = $input.val().toLowerCase();
      searchDimension.filter(function (d) {
        return d.indexOf(s) !== -1;
      });
      throttle();
      var throttleTimer;
      function throttle() {
        window.clearTimeout(throttleTimer);
        throttleTimer = window.setTimeout(function () {
          dc.redrawAll();
        }, 250);
      }
    }

    //Set word for wordcloud
    var setword = function (wd) {
      $("#search-input").val(wd);
      var s = wd.toLowerCase();
      searchDimension.filter(function (d) {
        return d.indexOf(s) !== -1;
      });
      throttle();
      var throttleTimer;
      function throttle() {
        window.clearTimeout(throttleTimer);
        throttleTimer = window.setTimeout(function () {
          console.log("redraw");
          dc.redrawAll();
        }, 250);
      }
    };

    //DATEPICKER FUNCTIONALITY
    var inidate;
    var enddate;
    //Initialize datepicker
    var dateFormat = "yy-mm-dd",
      from = $("#from")
        .datepicker({
          defaultDate: vuedata.selectedYear + "-01-01",
          minDate: vuedata.selectedYear + "-01-01",
          changeMonth: true,
          bootcssVer: 3,
          dateFormat: dateFormat,
        })
        .on("change", function () {
          to.datepicker("option", "minDate", getDate(this));
          inidate = getDate(this);
        }),
      to = $("#to")
        .datepicker({
          defaultDate: vuedata.selectedYear + "-12-31",
          maxDate: vuedata.selectedYear + "-12-31",
          changeMonth: true,
          dateFormat: dateFormat,
        })
        .on("change", function () {
          from.datepicker("option", "maxDate", getDate(this));
          enddate = getDate(this);
        });
    //Get date
    function getDate(element) {
      var date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value);
      } catch (error) {
        date = null;
      }
      return date;
    }
    //Set ini and end default dates
    $("#from").val(vuedata.selectedYear + "-01-01");
    $("#to").val(vuedata.selectedYear + "-12-31");
    inidate = $("#from").datepicker("getDate");
    enddate = $("#to").datepicker("getDate");

    //Date filter
    $("#datefilter").click(function () {
      console.log(inidate + " " + enddate);
      dateDimension.filter(function (d) {
        return (
          d == "" ||
          (d.getTime() >= inidate.getTime() &&
            d.getTime() <= enddate.getTime())
        );
      });
      throttle();
      var throttleTimer;
      function throttle() {
        window.clearTimeout(throttleTimer);
        throttleTimer = window.setTimeout(function () {
          dc.redrawAll();
        }, 250);
      }
    });

    //Cpv filter select
    $("#filterselect-cpv").change(function () {
      var selectedCpv = this.value;
      if (selectedCpv == "all") {
        cpvDimension.filter(null);
      } else {
        cpvDimension.filter(function (d) {
          return d.indexOf(selectedCpv) !== -1;
        });
      }
      dc.redrawAll();
      resizeGraphs();
    });

    //Reset charts
    var resetGraphs = function () {
      for (var c in charts) {
        if (charts[c].type !== "table" && charts[c].chart.hasFilter()) {
          charts[c].chart.filterAll();
        }
      }
      searchDimension.filter(null);
      dateDimension.filter(null);
      cpvDimension.filter(null);
      $("#from").val(vuedata.selectedYear + "-01-01");
      $("#to").val(vuedata.selectedYear + "-12-31");
      $("#filterselect-cpv").val("all");
      $("#search-input").val("");
      dc.redrawAll();
    };
    $(".reset-btn").click(function () {
      resetGraphs();
    });

    //Render charts
    createTypeDocChart();
    createTypeChart();
    createContractingBodiesChart();
    createContractorsChart();
    createCloudChart();
    createCpvChart();
    createFlagsChart();
    createTable();

    $(".dataTables_wrapper").append($(".dataTables_length"));

    //Hide loader
    vuedata.loader = false;

    //COUNTERS
    //Main counter
    var all = ndx.groupAll();
    var counter = dc.dataCount(".dc-data-count").dimension(ndx).group(all);
    counter.render();
    counter.on("renderlet.resetall", function (c) {
      RefreshTable();
    });

    //On modal close remove graph tooltips
    $("#detailsModal").on("hidden.bs.modal", function () {
      $(".graphtooltip").remove();
    });

    //Window resize function
    window.onresize = function (event) {
      resizeGraphs();
    };
  });
});
