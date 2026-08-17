// ─── Mock Geographical Data for Map Visualization ──────────────────────────────────────────

// Base center for Anandpur Sahib, Punjab
export const mapCenter: [number, number] = [31.2330, 76.5160];

// Constituency Boundary (Polygon)
export const constituencyGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Anandpur Sahib",
        type: "Constituency",
        code: "AC-042",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.45, 31.28],
            [76.58, 31.30],
            [76.62, 31.22],
            [76.54, 31.15],
            [76.42, 31.18],
            [76.45, 31.28],
          ]
        ]
      }
    }
  ]
};

// Wards (Polygons)
export const wardsGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Ward 1", population: 5000 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.50, 31.25],
            [76.52, 31.26],
            [76.53, 31.23],
            [76.51, 31.22],
            [76.50, 31.25],
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Ward 2", population: 4500 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.52, 31.26],
            [76.54, 31.27],
            [76.56, 31.24],
            [76.53, 31.23],
            [76.52, 31.26],
          ]
        ]
      }
    }
  ]
};

// Villages (Polygons)
export const villagesGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Village A", population: 1200 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.46, 31.27],
            [76.48, 31.27],
            [76.49, 31.25],
            [76.47, 31.24],
            [76.46, 31.27],
          ]
        ]
      }
    }
  ]
};

// Localities (Points)
export const localitiesGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Downtown Locality" },
      geometry: { type: "Point", coordinates: [76.515, 31.235] }
    },
    {
      type: "Feature",
      properties: { name: "Market Area" },
      geometry: { type: "Point", coordinates: [76.510, 31.240] }
    }
  ]
};

// Polling Stations (Points)
export const pollingStationsGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "PS 1 - City Hall",
        number: 1,
        address: "100 Main St"
      },
      geometry: { type: "Point", coordinates: [76.518, 31.238] }
    },
    {
      type: "Feature",
      properties: {
        name: "PS 2 - High School",
        number: 2,
        address: "250 Education Rd"
      },
      geometry: { type: "Point", coordinates: [76.530, 31.250] }
    },
    {
      type: "Feature",
      properties: {
        name: "PS 3 - Community Center",
        number: 3,
        address: "50 Park Ave"
      },
      geometry: { type: "Point", coordinates: [76.480, 31.260] }
    }
  ]
};

// Existing Geographical Divisions (Polygons)
export const divisionsGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "North Division", type: "Geographical Division" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.45, 31.28],
            [76.58, 31.30],
            [76.60, 31.25],
            [76.47, 31.25],
            [76.45, 31.28]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "South Division", type: "Geographical Division" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.47, 31.25],
            [76.60, 31.25],
            [76.62, 31.22],
            [76.54, 31.15],
            [76.42, 31.18],
            [76.47, 31.25]
          ]
        ]
      }
    }
  ]
};
