// ─── Mock Geographical Data for Map Visualization ──────────────────────────────────────────

// Base center for Muzaffarnagar, Uttar Pradesh
export const mapCenter: [number, number] = [29.4727, 77.7085];

// Constituency Boundary (Polygon)
export const constituencyGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Muzaffarnagar",
        type: "Constituency",
        code: "AC-042",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.6425, 29.5197],
            [77.7725, 29.5397],
            [77.8125, 29.4597],
            [77.7325, 29.3897],
            [77.6125, 29.4197],
            [77.6425, 29.5197],
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
            [77.6925, 29.4897],
            [77.7125, 29.4997],
            [77.7225, 29.4697],
            [77.7025, 29.4597],
            [77.6925, 29.4897],
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
            [77.7125, 29.4997],
            [77.7325, 29.5097],
            [77.7525, 29.4797],
            [77.7225, 29.4697],
            [77.7125, 29.4997],
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
            [77.6525, 29.5097],
            [77.6725, 29.5097],
            [77.6825, 29.4897],
            [77.6625, 29.4797],
            [77.6525, 29.5097],
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
      geometry: { type: "Point", coordinates: [77.7075, 29.4747] }
    },
    {
      type: "Feature",
      properties: { name: "Market Area" },
      geometry: { type: "Point", coordinates: [77.7025, 29.4797] }
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
      geometry: { type: "Point", coordinates: [77.7105, 29.4777] }
    },
    {
      type: "Feature",
      properties: {
        name: "PS 2 - High School",
        number: 2,
        address: "250 Education Rd"
      },
      geometry: { type: "Point", coordinates: [77.7225, 29.4897] }
    },
    {
      type: "Feature",
      properties: {
        name: "PS 3 - Community Center",
        number: 3,
        address: "50 Park Ave"
      },
      geometry: { type: "Point", coordinates: [77.6725, 29.4997] }
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
            [77.6425, 29.5197],
            [77.7725, 29.5397],
            [77.7925, 29.4897],
            [77.6625, 29.4897],
            [77.6425, 29.5197]
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
            [77.6625, 29.4897],
            [77.7925, 29.4897],
            [77.8125, 29.4597],
            [77.7325, 29.3897],
            [77.6125, 29.4197],
            [77.6625, 29.4897]
          ]
        ]
      }
    }
  ]
};
