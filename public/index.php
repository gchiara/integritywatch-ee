<html lang="en">
<head>
  <?php include 'gtag.php' ?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Ausa Riigi Valvur</title>
  <meta property="og:url" content="https://ausriik.ee" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ausa Riigi Valvur" />
  <meta property="og:description" content="Ausa Riigi Valvur" />
  <meta property="og:image" content="https://ausriik.ee/images/thumbnail.jpg" />
  <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="fonts/oswald.css">
  <link rel="stylesheet" href="static/notices.css?v=7">
</head>
<body>
    <div id="app" class="notices-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Riigihanked</h1>
              <h2>See on kasutajasõbralik interaktiivne andmebaas, mis pakub ainulaadset ülevaadet hanketeadetest.</h2>
              <a class="read-more-btn" href="./about.php?section=4">Loe lisaks</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/twitter-nobg.png" />Jaga Twitteris/X-s</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Jaga Facebookis</button>
              <p>Klõpsa allpool olevale graafikule või tabelile, et hanketeateid järjestada, sorteerida ja filtreerida.</p>
            </div>
            <i class="material-icons close-btn" @click="showInfo = false">close</i>
          </div>
        </div>
      </div>
      <!-- YEAR SELECTOR -->
      <div class="container-fluid year-selector-bar">
        <div class="row year-selector-bar-content">
          <div class="col-md-12">
            <span v-for="y in years">
              <a :href="'./index.php?y='+y" :class="{active: selectedYear == y}">{{y}}</a>
            </span>
            <div class="datefilter-container">
              <label for="from">Alates</label>
              <input type="text" id="from" name="from">
              <label for="to">kuni</label>
              <input type="text" id="to" name="to">
              <button id="datefilter">Filtreeri</button>
            </div>
          </div>
        </div>
      </div>
      <!-- MAIN -->
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- CHARTS - FIRST ROW -->
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_6">
              <chart-header :title="charts.flags.title" :info="charts.flags.info" ></chart-header>
              <div class="chart-inner" id="flags_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_1">
              <chart-header :title="charts.typeDoc.title" :info="charts.typeDoc.info" ></chart-header>
              <div class="chart-inner" id="typedoc_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_2">
              <chart-header :title="charts.type.title" :info="charts.type.info" ></chart-header>
              <div class="chart-inner" id="type_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_3">
              <chart-header :title="charts.contractingBodies.title" :info="charts.contractingBodies.info" ></chart-header>
              <div class="chart-inner" id="contractingbodies_chart"></div>
            </div>
          </div>
          <div class="col-lg-6 col-md-12 chart-col" id="wordcloud_chart_col">
            <div class="boxed-container chart-container notices_5">
              <chart-header :title="charts.cloud.title" :info="charts.cloud.info" ></chart-header>
              <div class="chart-inner" id="cloud_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_5">
              <chart-header :title="charts.cpv.title" :info="charts.cpv.info" ></chart-header>
              <div class="filterselect-container">
                <select id="filterselect-cpv">
                  <option value="all">All</option>
                  <option v-for="(item, index) in cpvList" :value="item" :key="index">{{item}}</option>
                </select>
              </div>
              <div class="chart-inner" id="cpv_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_4">
              <chart-header :title="charts.contractors.title" :info="charts.contractors.info" ></chart-header>
              <div class="chart-inner" id="contractors_chart"></div>
            </div>
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.table.title" :info="charts.table.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Nimetus</th> 
                      <th class="header">Teate liik</th> 
                      <th class="header">Teate avaldamise kuupäev</th> 
                      <th class="header">Hankija</th>
                      <th class="header">Kategooria</th>
                      <th class="header">Riskid</th> 
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filtreeri teksti järgi...">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>teadet <strong class="total-count">0</strong>-st
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Lähtesta filtrid</span></button>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="name">{{ selectedEl.contract_title }}<br /><span v-if="selectedEl.refnum">{{ selectedEl.refnum }}</span></div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="details-tables-buttons">
                    <button @click="modalShowTable = 'a'" :class="{active: modalShowTable == 'a'}">Ülevaade</button>
                    <button @click="modalShowTable = 'b'" :class="{active: modalShowTable == 'b'}" v-show="selectedEl.contracting_bodies && selectedEl.contracting_bodies.length > 0">Hankijad</button>
                    <button @click="modalShowTable = 'c'" :class="{active: modalShowTable == 'c'}" v-show="selectedEl.award_items && selectedEl.award_items.length > 0">Lepingu andmed</button>
                    <button @click="modalShowTable = 'd'" :class="{active: modalShowTable == 'd'}" v-show="selectedEl.changes && selectedEl.changes.length > 0">Muudatused</button>
                    <button @click="modalShowTable = 'e'" :class="{active: modalShowTable == 'e'}" v-show="selectedEl.linkedDocs && selectedEl.linkedDocs.length > 0">Seotud dokumendid</button>
                  </div>
                  <div class="col-md-12" v-show="modalShowTable == 'a'">
                    <div class="details-line"><span class="details-line-title">Teate avaldamise kuupäev:</span> {{ selectedEl.date_dispatch_notice }}</div>
                    <div class="details-line"><span class="details-line-title">Lepingu kategooria:</span> {{ selectedEl.contract_type }}</div>
                    <div class="details-line"><span class="details-line-title">Peamine CPV:</span> {{ selectedEl.cpvString }} ({{ selectedEl.cpv }})</div>
                    <div class="details-line" v-if="selectedEl.contract_value"><span class="details-line-title">Lepingu väärtus:</span> {{ selectedEl.contract_value }} {{ selectedEl.contract_value_curr }}</div>
                    <div class="details-line" v-if="selectedEl.flags && selectedEl.flags.length > 0"><span class="details-line-title">Riskid:</span> {{ selectedEl.flags.join(', ') }}</div>
                    <svg id="network-svg"></svg>
                  </div>
                  <!-- Contracting bodies -->
                  <div class="col-md-12" v-show="modalShowTable == 'b' && selectedEl.contracting_bodies && selectedEl.contracting_bodies.length > 0">
                    <hr />
                    <div class="details-table-title">Hankijad</div>
                    <div class="details-table-desc">Sellel vahekaardil kuvatakse antud teatega seotud hankija/tellija andmeid.</div>
                    <table id="modalTendersTableContracting" class="tenders-table">
                      <thead>
                        <tr><th>ID</th><th>Nimi</th><th>Haldusüksus</th></tr>
                      </thead>
                    </table>
                  </div>
                  <!-- Contract items -->
                  <div class="col-md-12" v-show="modalShowTable == 'c' && selectedEl.award_items && selectedEl.award_items.length > 0">
                    <hr />
                    <div class="details-table-title">Lepingu andmed</div>
                    <div class="details-table-desc">Sellel vahekaardil kuvatakse antud teatega seotud lepingute andmeid.</div>
                    <table id="modalTendersTableItems" class="tenders-table">
                      <thead>
                        <tr><th>Leping sõlmitud</th><th>Lepingu sõlmimise kuupäev</th><th>Lepingu maksumus</th><th>Pakkujad</th></tr>
                      </thead>
                    </table>
                  </div>
                  <!-- Changes -->
                  <div class="col-md-12" v-show="modalShowTable == 'd' && selectedEl.changes && selectedEl.changes.length > 0">
                    <hr />
                    <div class="details-table-title">Muudatused</div>
                    <div class="details-table-desc">Sellel vahekaardil kuvatakse antud teatega seotud muudatusi.</div>
                    <table id="modalTendersTableChanges" class="tenders-table">
                      <thead>
                        <tr><th>Vana</th><th>Uus</th><th>Asukoht</th></tr>
                      </thead>
                    </table>
                  </div>
                  <!-- Linked docs -->
                  <div class="col-md-12" v-show="modalShowTable == 'e' && selectedEl.linkedDocs && selectedEl.linkedDocs.length > 0">
                    <hr />
                    <div class="details-table-title">Seotud dokumendid</div>
                    <div class="details-table-desc">Sellel vahekaardil kuvatakse antud teatega seotud dokumentide andmeid.</div>
                    <table id="modalTendersTable" class="tenders-table">
                      <thead>
                        <tr><th>Nimetus</th><th>Avaldamise kuupäev</th><th>Kategooria</th><th>Hankija</th><th>Riskid</th></tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="''" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js?v=1"></script>
    <script type="text/javascript" src="vendor/js/network_graph.js"></script>

    <script src="static/notices.js?v=7"></script>

 
</body>
</html>