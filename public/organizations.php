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
  <link rel="stylesheet" href="static/organizations.css?v=11">
</head>
<body>
    <div id="app" class="organizations-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Juriidilised isikud ja erakondade rahastus</h1>
              <h2>See on kasutajasõbralik interaktiivne andmebaas, mis pakub ainulaadset ülevaadet hanketeadetes esinevatest hankijatest ja hangetes osalevatest ettevõtetest.</h2>
              <p>Klõpsa allpool olevale graafikule või tabelile, et juriidilisi isikuid järjestada, sorteerida ja filtreerida.</p>
              <a class="read-more-btn" href="./about.php?section=4">Loe lisaks</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/twitter-nobg.png" />Jaga Twitteris/X-s</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Jaga Facebookis</button>
            </div>
            <i class="material-icons close-btn" @click="showInfo = false">close</i>
          </div>
        </div>
      </div>
      <!-- Disclaimer -->
      <div class="top-description-disclaimer" v-if="showInfo">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-6 top-description-disclaimer-text">Alates 10. juulist 2026 võivad Eesti äriregistri tegelike kasusaajate andmetele kehtida uued juurdepääsupiirangud. Seetõttu ei pruugi Integrity Watch Estonia platvormil (Ausa Riigi Valvur) olla enam juurdepääsu täielikele tegelike kasusaajate andmetele, mida on seni kasutatud mõnede korruptsiooniriski indikaatorite arvutamisel. Sellest tulenevalt võivad tegelike kasusaajate andmetel põhinevad indikaatorid olla mittetäielikud või mitte enam täielikult ajakohased. MTÜ Korruptsioonivaba Eesti ei saa tagada selliste indikaatorite jätkuvat täpsust ega täielikkust seoses ametlike lähteandmete kättesaadavuse muutumisega.</div>
            <div class="col-md-6 top-description-disclaimer-text">From 10 July 2026, access to beneficial ownership information in the Estonian Business Register may be subject to new legal restrictions. As a result, Integrity Watch Estonia may no longer have access to the complete beneficial ownership data previously used to calculate certain risk indicators. Indicators and analyses that rely on beneficial ownership information may therefore be incomplete or no longer fully up to date. Transparency International Estonia cannot guarantee the continued accuracy or completeness of such indicators where this is a consequence of changes to the availability of official source data.</div>
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
              <chart-header :title="charts.topContractors.title" :info="charts.topContractors.info" ></chart-header>
              <div class="chart-inner" id="topcontractors_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_2">
              <chart-header :title="charts.topContracting.title" :info="charts.topContracting.info" ></chart-header>
              <div class="chart-inner" id="topcontracting_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_2">
              <chart-header :title="charts.beneficialOwners.title" :info="charts.beneficialOwners.info" ></chart-header>
              <div class="chart-inner" id="beneficialowners_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_6">
              <chart-header :title="charts.country.title" :info="charts.country.info" ></chart-header>
              <div class="chart-inner" id="country_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_6">
              <chart-header :title="charts.donations.title" :info="charts.donations.info" ></chart-header>
              <div class="chart-inner" id="donations_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_6">
              <chart-header :title="charts.topDonors.title" :info="charts.topDonors.info" ></chart-header>
              <div class="chart-inner" id="topdonors_chart"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 chart-col">
            <div class="boxed-container chart-container notices_6">
              <chart-header :title="charts.topOwners.title" :info="charts.topOwners.info" ></chart-header>
              <div class="chart-inner" id="topowners_chart"></div>
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
                      <th class="header">Nimi</th> 
                      <th class="header">Tegelikke kasusaajaid</th> 
                      <th class="header">Töövõtja teadetes</th> 
                      <th class="header">Hankija teadetes</th>
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
              <div class="filter-count">0</div>juriidilist isikut <strong class="total-count">0</strong>-st
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
                <div class="name">{{ selectedEl.name }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">Registrikood:</span> {{ selectedEl.id }}</div>
                    <div class="details-line" v-if="selectedEl.beneficial_owners"><span class="details-line-title">Tegelikud kasusaajad:</span> {{ selectedEl.boList.join(', ') }}</div>
                    <div class="details-line" v-if="selectedEl.flags && selectedEl.flags.length > 0"><span class="details-line-title">Riskid:</span> {{ selectedEl.flags.join(', ') }}</div>
                  </div>
                  <div class="details-tables-buttons">
                    <hr>
                    <button @click="modalShowTable = 'a'" :class="{active: modalShowTable == 'a'}" v-show="selectedEl.orgNotices">Hanketeated</button>
                    <button @click="modalShowTable = 'b'" :class="{active: modalShowTable == 'b'}" v-show="selectedEl.political_donations && selectedEl.political_donations.length > 0">Politiilised annetused</button>
                  </div>
                  <div class="col-md-12" v-show="modalShowTable == 'a' && selectedEl.orgNotices">
                    <div class="details-table-title">Seotud teated</div>
                    <div class="details-table-desc">Siin kuvatakse kõiki hanketeateid, kus antud juriidilist isikut on mainitud.</div>
                    <table id="modalTendersTable" class="tenders-table">
                      <thead>
                        <tr><th>Nimetus</th><th>Avaldamise kuupäev</th><th>Kategooria</th><th>Juriidilise isiku roll</th></tr>
                      </thead>
                    </table>
                  </div>
                  <div class="col-md-12" v-show="modalShowTable == 'b' && selectedEl.political_donations && selectedEl.political_donations.length > 0">
                    <div class="details-table-title">Annetused erakondadele</div>
                    <div class="details-table-desc">Siin kajastuvad kõik juriidilise isikuga seotud ülekanded erakondadele (annetused ettevõtte tegeliku kasusaaja poolt).</div>
                    <table id="modalTendersTableDonations" class="tenders-table">
                      <thead>
                        <tr><th>Annetaja</th><th>Erakond</th><th>Summa (EUR)</th><th>Kuupäev</th><th>Rahastuse liik</th></tr>
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

    <script src="static/organizations.js?v=11"></script>

 
</body>
</html>