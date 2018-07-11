const map = L.map('map').setView([-28.75, 26.5], 6);

// Adding Voyager Basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

//Carto user API details
const client = new carto.Client({
  apiKey: 'TM_qyCoEkChtuUKLQfbFAQ',
  username: 'urbanearth'
});

//District boundary layer
const boundariesDataset = new carto.source.Dataset('districtmunicipality2016');
const boundariesStyle = new carto.style.CartoCSS(`
        #layer {      
          ::outline {
            line-width: 1;
            line-color: #000000;
            line-opacity: 1;
          }
        #layer::labels {
            text-name: [district];
            text-face-name: 'DejaVu Sans Book';
            text-size: 12;
            text-fill: #000000;
            text-label-position-tolerance: 0;            
            text-dy: 0;
            text-allow-overlap: true;
            text-placement: point;
            text-placement-type: dummy;
          }
        }
      `);
const boundaries = new carto.layer.Layer(boundariesDataset, boundariesStyle);

const veldfireDataset = new carto.source.Dataset('veldfire_risk_2010');
const veldfireStyle = new carto.style.CartoCSS(`
        #layer {
          polygon-fill: ramp([overall], (#bd0026, #f03b20, #fede96, #ff9532), (Extreme, High, Low, Medium), "=");
          polygon-opacity: 0.6;
        }
        #layer::outline {
          line-width: 0.5;
          line-color: #FFF;
          line-opacity: 1;
        }
      `);
const veldfire = new carto.layer.Layer(veldfireDataset, veldfireStyle);

client.addLayers([veldfire, boundaries]);
client.getLeafletLayer().addTo(map);

veldfire.on('metadataChanged', function (event) {
  event.styles.forEach(function (styleMetadata) {
    switch (styleMetadata.getProperty()) {
      case 'polygon-fill':
        renderLegendRisk(styleMetadata);
        break;
    }
  });
});

function renderLegendRisk(metadata) {
  const categories = metadata.getCategories();

  for (category of categories) {
    switch (category.name) {
      case 'Extreme':
        document.getElementById('Extreme').innerHTML = `<div class="circle" style="background:${category.value}"></div> Extreme`;
        break;
      case 'High':
        document.getElementById('High').innerHTML = `<div class="circle" style="background:${category.value}"></div> High`;
        break;
      case 'Medium':
        document.getElementById('Medium').innerHTML = `<div class="circle" style="background:${category.value}"></div> Medium`;
        break;
      case 'Low':
        document.getElementById('Low').innerHTML = `<div class="circle" style="background:${category.value}"></div> Low`;
        break;
    }
  }
}