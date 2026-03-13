import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import type { LatLngExpression, LatLngBoundsExpression } from "leaflet";
import { latLngBounds } from "leaflet";

type HabitatArea = {
  type?: "Polygon" | "MultiPolygon" | string;
  coordinates?: number[][][][] | number[][][] | null;
};

type SpeciesHabitatMapProps = {
  habitatArea?: HabitatArea | null;
  height?: number;
  commonName?: string;
  scientificName?: string;
  populationStatus?: string;
};

const normalizePolygons = (
  coords?: number[][][][] | number[][][] | null,
): LatLngExpression[][][] | null => {
  if (!coords || coords.length === 0) return null;

  const first = coords[0] as unknown;
  const isPolygonRings =
    Array.isArray(first) &&
    Array.isArray(first[0]) &&
    typeof (first as number[][])[0][0] === "number";

  const polygons = isPolygonRings
    ? [coords as number[][][]]
    : (coords as number[][][][]);

  if (!polygons || polygons.length === 0) return null;

  return polygons.map((rings) =>
    rings.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as LatLngExpression),
    ),
  );
};

const SpeciesHabitatMap = ({
  habitatArea,
  height = 320,
  commonName,
  scientificName,
  populationStatus,
}: SpeciesHabitatMapProps) => {
  const polygons = useMemo(
    () => normalizePolygons(habitatArea?.coordinates),
    [habitatArea?.coordinates],
  );

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (!polygons) return null;
    return latLngBounds(polygons.flat(2) as LatLngExpression[]);
  }, [polygons]);

  if (!polygons || !bounds) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: "12px",
          border: "1px solid rgba(109,220,139,0.12)",
          backgroundColor: "rgba(11,28,18,0.7)",
        }}
      >
        <Typography sx={{ color: "#b7d7c4" }}>
          Habitat map is not available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(109,220,139,0.12)",
        height,
      }}
    >
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        bounds={bounds}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polygons.map((polygon, index) => (
          <Polygon
            key={`habitat-polygon-${index}`}
            positions={polygon}
            pathOptions={{ color: "#8be0a6", weight: 2, fillOpacity: 0.25 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95} sticky>
              <div style={{ color: "#0b1c12", fontWeight: 600 }}>
                {commonName || "Unknown species"}
              </div>
              <div style={{ color: "#0b1c12", fontStyle: "italic" }}>
                {scientificName || "Scientific name not available"}
              </div>
              <div style={{ color: "#0b1c12" }}>
                Population: {populationStatus || "Unknown"}
              </div>
            </Tooltip>
          </Polygon>
        ))}
      </MapContainer>
    </Box>
  );
};

export default SpeciesHabitatMap;
