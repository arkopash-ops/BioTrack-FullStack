import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import type { DashboardUser as User } from "../../interfaces";

interface SpeciesItem {
  _id: string;
  commonName: string;
  scientificName: string;
  populationStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [species, setSpecies] = useState<SpeciesItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingSpecies, setLoadingSpecies] = useState(true);
  const navigate = useNavigate();

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
      const role = user.role || "unknown";
      if (!acc[role]) acc[role] = [];
      acc[role].push(user);
      return acc;
    },
    {} as Record<string, User[]>,
  );

  // Navigate to GetProfile page
  const handleGetProfile = (userId: string) => {
    navigate(`/admin/profile/${userId}`);
  };

  const glassCardSx = {
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "none",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  const tableHeadCellSx = {
    color: "#e0f7e9",
    fontWeight: "bold",
    borderBottomColor: "rgba(255,255,255,0.12)",
  };

  const tableBodyCellSx = {
    color: "#fff",
    borderBottomColor: "rgba(255,255,255,0.08)",
  };

  return (
    <Box p={3} sx={{ color: "#fff" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#fff", fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <Typography variant="h6">Users by Role</Typography>
            <Chip
              label={`${users.length} total`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ color: "#e0f7e9", borderColor: "rgba(224,247,233,0.6)" }}
            />
          </Stack>

          {loadingUsers ? (
            <Typography>Loading users...</Typography>
          ) : (
            Object.keys(usersByRole)
              .sort()
              .map((role) => (
                <Box key={role} mb={3}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
                      {role}
                    </Typography>
                    <Chip
                      label={usersByRole[role].length}
                      size="small"
                      sx={{
                        color: "#e0f7e9",
                        borderColor: "rgba(224,247,233,0.6)",
                        backgroundColor: "rgba(46, 204, 113, 0.15)",
                      }}
                      variant="outlined"
                    />
                  </Stack>

                  <TableContainer component={Paper} sx={glassCardSx}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeadCellSx}>Profile</TableCell>
                          <TableCell sx={tableHeadCellSx}>Name</TableCell>
                          <TableCell sx={tableHeadCellSx}>Email</TableCell>
                          <TableCell sx={tableHeadCellSx}>Phone</TableCell>
                          <TableCell sx={tableHeadCellSx}>Bio</TableCell>
                          <TableCell sx={tableHeadCellSx}>Address</TableCell>
                          <TableCell sx={tableHeadCellSx}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {usersByRole[role].map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>
                              <Avatar
                                src={
                                  user.profileImage
                                    ? `http://localhost:8080/public/${user.profileImage}`
                                    : "http://localhost:8080/public/default/default-profile.jpg"
                                }
                                alt={user.name}
                                sx={{ border: "2px solid rgba(255,255,255,0.2)" }}
                              />
                            </TableCell>
                            <TableCell sx={tableBodyCellSx}>{user.name}</TableCell>
                            <TableCell sx={tableBodyCellSx}>{user.email}</TableCell>
                            <TableCell sx={tableBodyCellSx}>{user.phoneNo || "-"}</TableCell>
                            <TableCell sx={tableBodyCellSx}>{user.bio}</TableCell>
                            <TableCell sx={tableBodyCellSx}>
                              {`${user.addresses.street || "-"}, ${user.addresses.city || "-"}, ${
                                user.addresses.state || "-"
                              } - ${user.addresses.zip || "-"}, ${
                                user.addresses.country || "-"
                              }`}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="success"
                                sx={{
                                  backgroundColor: "#2ecc71",
                                  "&:hover": { backgroundColor: "#27ae60" },
                                }}
                                onClick={() => handleGetProfile(user._id)}
                              >
                                Get Profile
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <Box>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <Typography variant="h6">Species Inserted</Typography>
            <Chip
              label={`${species.length} total`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ color: "#e0f7e9", borderColor: "rgba(224,247,233,0.6)" }}
            />
          </Stack>

          {loadingSpecies ? (
            <Typography>Loading species...</Typography>
          ) : (
            <TableContainer component={Paper} sx={glassCardSx}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeadCellSx}>Common Name</TableCell>
                    <TableCell sx={tableHeadCellSx}>Scientific Name</TableCell>
                    <TableCell sx={tableHeadCellSx}>Status</TableCell>
                    <TableCell sx={tableHeadCellSx}>Created</TableCell>
                    <TableCell sx={tableHeadCellSx}>Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {species.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell sx={tableBodyCellSx}>{item.commonName}</TableCell>
                      <TableCell sx={tableBodyCellSx}>{item.scientificName}</TableCell>
                      <TableCell sx={tableBodyCellSx}>{item.populationStatus || "-"}</TableCell>
                      <TableCell sx={tableBodyCellSx}>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell sx={tableBodyCellSx}>
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default AdminDashboard;
