import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import Grid from "@mui/system/Grid";
import SpeciesCard from "../../components/SpeciesCard";
import PieChart from "../../components/PieChart";

interface SpeciesItem {
  _id: string;
  commonName: string;
  scientificName: string;
  populationStatus?: string;
}

const Species = () => {
  const [species, setSpecies] = useState<SpeciesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statusOptions = [
    "all",
    "Least Concern",
    "Vulnerable",
    "Endangered",
    "Critically Endangered",
    "Extinct",
    "Unknown",
  ];

  const activeSearch = search.trim();
  const activeFilter = statusFilter !== "all";

  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:8080/api/species";
        const params: Record<string, string> = {};

        if (activeSearch) {
          url = "http://localhost:8080/api/species/search";
          params.q = activeSearch;
        } else if (activeFilter) {
          url = "http://localhost:8080/api/species/filter";
          params.populationStatus = statusFilter;
        }

        const res = await axios.get(url, { withCredentials: true, params });
        if (res.data.success) {
          setSpecies(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, [activeSearch, activeFilter, statusFilter]);

  const filteredSpecies = useMemo(() => {
    if (activeSearch && activeFilter) {
      return species.filter(
        (item) => (item.populationStatus || "Unknown") === statusFilter,
      );
    }
    return species;
  }, [species, activeSearch, activeFilter, statusFilter]);

  const speciesByStatus = filteredSpecies.reduce(
    (acc, item) => {
      const status = item.populationStatus || "Unknown";
      if (!acc[status]) acc[status] = 0;
      acc[status] += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const speciesStatuses = Object.entries(speciesByStatus);
  const speciesTotal = filteredSpecies.length;

  const chartColors = [
    "#8A0303",
    "#d84c0b",
    "#0a42da",
    "#00ff00",
    "#ecaf06",
  ];
  const speciesItems = speciesStatuses.map(([status, count]) => ({
    label: status,
    value: count,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "16px",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#fff", fontWeight: "bold" }}
            >
              Species
            </Typography>

            <Stack spacing={3} mt={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box flex={1}>
                  <Typography sx={{ color: "#e0f7e9", fontWeight: "bold", mb: 2 }}>
                    Filters
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Search common or scientific name"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      fullWidth
                      sx={{
                        input: { color: "#fff" },
                        label: { color: "#e0f7e9" },
                      }}
                    />
                    <TextField
                      select
                      label="Status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{
                        minWidth: 180,
                        input: { color: "#fff" },
                        label: { color: "#e0f7e9" },
                      }}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status === "all" ? "All" : status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  <Stack direction="row" spacing={1} mt={2}>
                    <Chip
                      label={`${speciesTotal} shown`}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ color: "#e0f7e9", borderColor: "rgba(224,247,233,0.6)" }}
                    />
                  </Stack>
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: "rgba(255,255,255,0.12)",
                    display: { xs: "none", md: "block" },
                  }}
                />
                <Box flex={1}>
                  <Typography sx={{ color: "#e0f7e9", fontWeight: "bold", mb: 2 }}>
                    Species by Status
                  </Typography>
                  {loading ? (
                    <Typography sx={{ color: "#e0f7e9" }}>Loading chart...</Typography>
                  ) : speciesStatuses.length === 0 ? (
                    <Typography sx={{ color: "#e0f7e9" }}>No species data.</Typography>
                  ) : (
                    <PieChart items={speciesItems} colors={chartColors} />
                  )}
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", mb: 2 }}>
            Species List
          </Typography>

          {loading ? (
            <Typography sx={{ color: "#e0f7e9" }}>Loading species...</Typography>
          ) : filteredSpecies.length === 0 ? (
            <Typography sx={{ color: "#e0f7e9" }}>No species found.</Typography>
          ) : (
            <Box
              sx={{
                columnCount: { xs: 1, sm: 2, md: 3 },
                columnGap: 16,
                columnFill: "balance",
                "& > *": {
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  mb: 2,
                  display: "inline-block",
                  width: "100%",
                },
              }}
            >
              {filteredSpecies.map((item) => (
                <Box key={item._id}>
                  <SpeciesCard
                    commonName={item.commonName}
                    scientificName={item.scientificName}
                    status={item.populationStatus || "Unknown"}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Species;
