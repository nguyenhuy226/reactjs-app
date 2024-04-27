import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import AppsIcon from "@mui/icons-material/Apps";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { ReactComponent as trelloIcon } from "~/assets/mdi--trello.svg";
import Profiles from "./Menus/Profiles";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import WorkSpaces from "./Menus/WorkSpaces";
import ModeSelect from "../ModeSelect/ModeSelect";
function AppBar() {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        paddingX: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "white" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SvgIcon
            component={trelloIcon}
            inheritViewBox
            fontSize="small"
            sx={{ color: "white" }}
          />
          <Typography
            variant="span"
            sx={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Trello
          </Typography>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <WorkSpaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            variant="outlined"
            startIcon={<AddToPhotosIcon />}
            sx={{
              color: "white",
              border: "none",
              "&:hover": { border: "none" },
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size="small"
          sx={{
            minWidth: 120,
            maxWidth: 180,
            "& label": { color: "white" },
            "&:hover label": { color: "white" },
            "& input": { color: "white" },
            "& label.Mui-focused": { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "white" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                sx={{
                  color: searchValue ? "white" : "transparent",
                  size: "small",
                  cursor: "pointer",
                }}
                onClick={(e) => setSearchValue("")}
              />
            ),
          }}
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon sx={{ color: "white" }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: "pointer", color: "white" }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
