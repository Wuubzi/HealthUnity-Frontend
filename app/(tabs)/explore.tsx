import React from "react";
import { WebView } from "react-native-webview";

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var center = [10.9790, -74.8000];
      var map = L.map('map', {
        center: center,
        zoom: 13,
        minZoom: 11,
        maxZoom: 17
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      var bounds = L.latLngBounds(
        [10.85, -74.92],  
        [11.05, -74.73]   
      );
      map.setMaxBounds(bounds);
      map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
      });

      L.marker([10.9790, -74.8000]).addTo(map)
        .bindPopup('Barranquilla')
        .openPopup();
    </script>
  </body>
</html>
`;

export default function Explore() {
  return <WebView originWhitelist={["*"]} source={{ html }} />;
}
