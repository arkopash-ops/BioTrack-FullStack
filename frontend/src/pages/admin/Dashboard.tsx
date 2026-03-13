import { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, Chip, Divider } from "@mui/material";
import axios from "axios";
import type { DashboardUser as User } from "../../interfaces";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";

interface SpeciesItem {
  _id: string;
  populationStatus?: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [species, setSpecies] = useState<SpeciesItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSpecies, setLoadingSpecies] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/admin/allProfiles",
          {
            withCredentials: true,
          },
        );
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchSpecies = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/species", {
          withCredentials: true,
        });
        if (res.data.success) {
          setSpecies(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        setLoadingSpecies(false);
      }
    };

    fetchUsers();
    fetchSpecies();
  }, []);

  const usersByRole = users.reduce(
    (acc, user) => {
      const role = (user.role || "unknown").toLowerCase();
      if (!acc[role]) acc[role] = 0;
      acc[role] += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalUsers = users.length;
  const researcherCount = usersByRole.researcher || 0;
  const visitorCount = usersByRole.visitor || 0;

  const speciesByStatus = species.reduce(
    (acc, item) => {
      const status = item.populationStatus || "Unknown";
      if (!acc[status]) acc[status] = 0;
      acc[status] += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const glassCardSx = {
    backgroundColor: "rgba(8,18,12,0.72)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "none",
    border: "1px solid rgba(109,220,139,0.18)",
  };

  const cardTitleSx = { color: "#b7d7c4", fontWeight: "bold" };
  const cardValueSx = { color: "#e6f5ec", fontWeight: "bold", fontSize: 28 };
  const chartBarColor = "#3bbf7a";
  const chartColors = ["#1f6b3a", "#2f9e5b", "#3bbf7a", "#7fc97f", "#c9b458"];
  const speciesStatuses = Object.entries(speciesByStatus);
  const speciesTotal = species.length;
  const maxRoleCount = Math.max(researcherCount, visitorCount, 1);
  const roleItems = [
    { label: "Researchers", value: researcherCount },
    { label: "Visitors", value: visitorCount },
  ];
  const speciesItems = speciesStatuses.map(([status, count]) => ({
    label: status,
    value: count,
  }));

  return (
    <Box p={3} sx={{ color: "#e6f5ec" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#e6f5ec", fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ ...glassCardSx, p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box flex={1}>
              <Typography sx={cardTitleSx}>Total Users</Typography>
              {loadingUsers ? (
                <Typography sx={{ color: "#b7d7c4" }}>Loading...</Typography>
              ) : (
                <Typography sx={cardValueSx}>{totalUsers}</Typography>
              )}
            </Box>
            <Box flex={1}>
              <Typography sx={cardTitleSx}>Researchers</Typography>
              {loadingUsers ? (
                <Typography sx={{ color: "#b7d7c4" }}>Loading...</Typography>
              ) : (
                <Typography sx={cardValueSx}>{researcherCount}</Typography>
              )}
            </Box>
            <Box flex={1}>
              <Typography sx={cardTitleSx}>Visitors</Typography>
              {loadingUsers ? (
                <Typography sx={{ color: "#b7d7c4" }}>Loading...</Typography>
              ) : (
                <Typography sx={cardValueSx}>{visitorCount}</Typography>
              )}
            </Box>
            <Box flex={1}>
              <Typography sx={cardTitleSx}>Species</Typography>
              {loadingSpecies ? (
                <Typography sx={{ color: "#b7d7c4" }}>Loading...</Typography>
              ) : (
                <Typography sx={cardValueSx}>{speciesTotal}</Typography>
              )}
            </Box>
          </Stack>
        </Paper>

        <Divider sx={{ borderColor: "rgba(109,220,139,0.18)" }} />

        <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
          <Paper sx={{ ...glassCardSx, p: 3, flex: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: "#e6f5ec" }}>
                Users by Role
              </Typography>
              <Chip
                label={`${researcherCount + visitorCount} total`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ color: "#b7d7c4", borderColor: "rgba(109,220,139,0.45)" }}
              />
            </Stack>

            {loadingUsers ? (
              <Typography sx={{ color: "#b7d7c4" }}>Loading chart...</Typography>
            ) : (
              <BarChart
                items={roleItems}
                height={180}
                maxValue={maxRoleCount}
                barColor={chartBarColor}
                barShadow="0 8px 20px rgba(59,191,122,0.35)"
              />
            )}
          </Paper>

          <Paper sx={{ ...glassCardSx, p: 3, flex: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: "#e6f5ec" }}>
                Species by Status
              </Typography>
              <Chip
                label={`${speciesTotal} total`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ color: "#b7d7c4", borderColor: "rgba(109,220,139,0.45)" }}
              />
            </Stack>

            {loadingSpecies ? (
              <Typography sx={{ color: "#b7d7c4" }}>Loading chart...</Typography>
            ) : speciesStatuses.length === 0 ? (
              <Typography sx={{ color: "#b7d7c4" }}>No species data.</Typography>
            ) : (
              <PieChart items={speciesItems} colors={chartColors} />
            )}
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AdminDashboard;
