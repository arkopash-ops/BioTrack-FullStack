import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Avatar,
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import type { DashboardUser as User } from "../../interfaces";
import BarChart from "../../components/BarChart";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
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
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const usersByRole = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        const role = (user.role || "unknown").toLowerCase();
        if (!acc[role]) acc[role] = 0;
        acc[role] += 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [users]);

  const researcherCount = usersByRole.researcher || 0;
  const visitorCount = usersByRole.visitor || 0;
  const maxRoleCount = Math.max(researcherCount, visitorCount, 1);
  const roleItems = [
    { label: "Researchers", value: researcherCount },
    { label: "Visitors", value: visitorCount },
  ];

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      const role = (user.role || "unknown").toLowerCase();
      const matchesRole = roleFilter === "all" || role === roleFilter;
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const glassCardSx = {
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    boxShadow: "none",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  const chartBarColor = "#2000d8";

  return (
    <Box p={3} sx={{ color: "#fff" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#fff", fontWeight: "bold" }}
      >
        Admin
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ ...glassCardSx, p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box flex={1}>
              <Typography sx={{ color: "#e0f7e9", fontWeight: "bold" }}>
                Users by Role
              </Typography>
              {loading ? (
                <Typography sx={{ color: "#e0f7e9" }}>Loading...</Typography>
              ) : (
                <Box mt={2}>
                  <BarChart
                    items={roleItems}
                    height={180}
                    maxValue={maxRoleCount}
                    barColor={chartBarColor}
                    barShadow="0 8px 20px rgba(46,204,113,0.25)"
                  />
                </Box>
              )}
            </Box>
            <Box flex={1}>
              <Typography sx={{ color: "#e0f7e9", fontWeight: "bold", mb: 2 }}>
                Filters
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Search name or email"
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
                  label="Role"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  sx={{
                    minWidth: 160,
                    input: { color: "#fff" },
                    label: { color: "#e0f7e9" },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="researcher">Researcher</MenuItem>
                  <MenuItem value="visitor">Visitor</MenuItem>
                </TextField>
              </Stack>
              <Stack direction="row" spacing={1} mt={2}>
                <Chip
                  label={`${filteredUsers.length} shown`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{
                    color: "#e0f7e9",
                    borderColor: "rgba(224,247,233,0.6)",
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ ...glassCardSx, p: 2 }}>
          {loading ? (
            <Typography sx={{ color: "#e0f7e9" }}>Loading users...</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#e0f7e9", fontWeight: "bold" }}>
                      Profile
                    </TableCell>
                    <TableCell sx={{ color: "#e0f7e9", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "#e0f7e9", fontWeight: "bold" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "#e0f7e9", fontWeight: "bold" }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: "#e0f7e9", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
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
                      <TableCell sx={{ color: "#fff" }}>{user.name}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>{user.email}</TableCell>
                      <TableCell
                        sx={{ color: "#fff", textTransform: "capitalize" }}
                      >
                        {user.role || "unknown"}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="success"
                            sx={{
                              backgroundColor: "#2ecc71",
                              "&:hover": { backgroundColor: "#27ae60" },
                            }}
                            onClick={() =>
                              navigate(`/admin/profile/${user._id}`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{
                              color: "#e0f7e9",
                              borderColor: "rgba(224,247,233,0.6)",
                            }}
                            onClick={() =>
                              navigate(`/admin/edit-profile/${user._id}`)
                            }
                          >
                            Edit
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default Users;
