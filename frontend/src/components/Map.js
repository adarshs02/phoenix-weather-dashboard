import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Helper function to get color based on temperature
function getTemperatureColor(temp) {
  if (temp === null || temp === undefined) return '#808080'; // Gray for no data
  if (temp <= 50) return '#4A90E2'; // Cool blue
  if (temp <= 65) return '#50C878'; // Light green
  if (temp <= 75) return '#90EE90'; // Pale green
  if (temp <= 85) return '#FFD700'; // Gold
  if (temp <= 95) return '#FF8C00'; // Dark orange
  if (temp <= 105) return '#FF4500'; // Orange red
  return '#DC143C'; // Crimson for extreme heat
}

// Create custom colored marker icon
function createColoredIcon(color, label) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 11px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">${label || ''}</div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
  });
}

const Map = forwardRef(({ data, onMarkerClick }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Expose flyToStation method to parent component
  useImperativeHandle(ref, () => ({
    flyToStation: (latitude, longitude) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([latitude, longitude], 14, {
          duration: 1.5
        });
      }
    }
  }));

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([33.4484, -111.9400], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);

      // Add temperature legend
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'temp-legend');
        div.innerHTML = `
          <div style="
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-size: 12px;
            line-height: 1.4;
          ">
            <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold;">Temperature</h4>
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 20px; height: 20px; background: #4A90E2; border-radius: 50%; margin-right: 8px;"></span>
              ≤50°F
            </div>
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 20px; height: 20px; background: #50C878; border-radius: 50%; margin-right: 8px;"></span>
              51-65°F
            </div>
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 20px; height: 20px; background: #90EE90; border-radius: 50%; margin-right: 8px;"></span>
              66-75°F
            </div>
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 20px; height: 20px; background: #FFD700; border-radius: 50%; margin-right: 8px;"></span>
              76-85°F
            </div>
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 20px; height: 20px; background: #FF8C00; border-radius: 50%; margin-right: 8px;"></span>
              86-95°F
            </div>
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 20px; height: 20px; background: #FF4500; border-radius: 50%; margin-right: 8px;"></span>
              96-105°F
            </div>
            <div style="display: flex; align-items: center; margin: 3px 0;">
              <span style="display: inline-block; width: 20px; height: 20px; background: #DC143C; border-radius: 50%; margin-right: 8px;"></span>
              >105°F
            </div>
          </div>
        `;
        return div;
      };
      legend.addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each station
    if (data && data.length > 0) {
      data.forEach(station => {
        // Get temperature reading for color coding
        let temperature = null;
        if (station.readings && station.readings.length > 0) {
          const tempReading = station.readings.find(r => r.variable_code === 'TEMP' || r.variable_code === 'HEAT_INDEX');
          if (tempReading) {
            temperature = tempReading.value_num;
          }
        }

        // Get color based on temperature
        const markerColor = getTemperatureColor(temperature);
        const tempLabel = temperature ? Math.round(temperature) : '?';

        // Create colored marker
        const icon = createColoredIcon(markerColor, tempLabel);
        const marker = L.marker([station.latitude, station.longitude], { icon })
          .addTo(mapInstanceRef.current);

        // Create popup content
        const popupContent = createPopupContent(station);
        marker.bindPopup(popupContent);

        // Optional: add click handler
        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(station);
          }
        });

        markersRef.current.push(marker);
      });

      // Fit map to show all markers
      if (markersRef.current.length > 0) {
        const group = L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    // Cleanup function
    return () => {
      // Don't destroy the map on every render, only on unmount
    };
  }, [data, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
});

Map.displayName = 'Map';

export default Map;

function createPopupContent(station) {
  let html = `
    <div style="min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
        ${station.station_name}
      </h3>
      <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
        Source: ${station.source_name}
      </p>
  `;

  if (station.readings && station.readings.length > 0) {
    station.readings.forEach(reading => {
      const timestamp = new Date(reading.observed_at).toLocaleString();
      let displayValue = reading.value_num !== null
        ? `${reading.value_num.toFixed(1)} ${reading.variable_unit}`
        : reading.value_text || 'N/A';

      let valueColor = '#000';

      // Color code AQI values
      if (reading.variable_code === 'AQI') {
        if (reading.value_num <= 50) valueColor = '#00e400';
        else if (reading.value_num <= 100) valueColor = '#ffff00';
        else if (reading.value_num <= 150) valueColor = '#ff7e00';
        else if (reading.value_num <= 200) valueColor = '#ff0000';
        else if (reading.value_num <= 300) valueColor = '#8f3f97';
        else valueColor = '#7e0023';
      }

      html += `
        <div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
          <div style="font-weight: bold; color: ${valueColor};">
            ${reading.variable_code}: ${displayValue}
          </div>
          <div style="font-size: 11px; color: #888; margin-top: 4px;">
            ${timestamp}
          </div>
        </div>
      `;
    });
  } else {
    html += '<p style="color: #999; font-style: italic;">No data available</p>';
  }

  html += '</div>';
  return html;
}
