import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import type { LatLngExpression, LatLngBoundsExpression } from "leaflet";
import { latLngBounds } from "leaflet";

type HabitatArea = {
  type?: "Polygon" | "MultiPolygon" | string;
  coordinates?: number[][][][] | number[][][] | null;
};

type SpeciesMapItem = {
  _id: string;
  commonName?: string;
  scientificName?: string;
  slug?: string;
  habitatArea?: HabitatArea | null;
};

type AllSpeciesHabitatMapProps = {
  items?: SpeciesMapItem[];
  height?: number;
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

const AllSpeciesHabitatMap = ({
  items = [],
  height = 360,
}: AllSpeciesHabitatMapProps) => {
  const palette = [
    { stroke: "#8be0a6", fill: "rgba(139,224,166,0.35)" },
    { stroke: "#6fc6ea", fill: "rgba(111,198,234,0.35)" },
    { stroke: "#f2c974", fill: "rgba(242,201,116,0.35)" },
    { stroke: "#c89bff", fill: "rgba(200,155,255,0.35)" },
    { stroke: "#ff9f9f", fill: "rgba(255,159,159,0.35)" },
    { stroke: "#8ad1e6", fill: "rgba(138,209,230,0.35)" },
    { stroke: "#a6e08b", fill: "rgba(166,224,139,0.35)" },
  ];

  const colorFor = (id?: string, index = 0) => {
    if (!id) return palette[index % palette.length];
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    return palette[hash % palette.length];
  };

  const polygonItems = useMemo(() => {
    return items
      .map((item) => ({
        ...item,
        polygons: normalizePolygons(item.habitatArea?.coordinates ?? null),
      }))
      .filter((item) => item.polygons && item.polygons.length > 0);
  }, [items]);

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (polygonItems.length === 0) return null;
    const points = polygonItems.flatMap((item) =>
      item.polygons ? item.polygons.flat(2) : [],
    );
    if (points.length === 0) return null;
    return latLngBounds(points as LatLngExpression[]);
  }, [polygonItems]);

  if (!bounds) {
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
          No habitat areas available.
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
        {polygonItems.map((item, itemIndex) =>
          (item.polygons ?? []).map((polygon, polyIndex) => (
            <Polygon
              key={`${item._id}-${itemIndex}-${polyIndex}`}
              positions={polygon}
              pathOptions={{
                color: colorFor(item._id, itemIndex).stroke,
                fillColor: colorFor(item._id, itemIndex).fill,
                weight: 2,
                fillOpacity: 0.45,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95} sticky>
                <div style={{ color: "#0b1c12", fontWeight: 600 }}>
                  {item.commonName || "Unknown species"}
                </div>
                <div style={{ color: "#0b1c12", fontStyle: "italic" }}>
                  {item.scientificName || "Scientific name not available"}
                </div>
                {item.slug ? (
                  <div style={{ color: "#0b1c12" }}>Slug: {item.slug}</div>
                ) : null}
              </Tooltip>
            </Polygon>
          )),
        )}
      </MapContainer>
    </Box>
  );
};

export default AllSpeciesHabitatMap;
