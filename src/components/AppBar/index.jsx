import AppsIcon from "@mui/icons-material/Apps";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ReactComponent as trelloIcon } from "~/assets/mdi--trello.svg";
import ModeSelect from "../ModeSelect";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import WorkSpaces from "./Menus/WorkSpaces";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Profiles from "./Menus/Profiles";
function AppBar() {
  return (
    <Box
      px={2}
      sx={{
        width: "100%",
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "primary.main" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <SvgIcon
            component={trelloIcon}
            inheritViewBox
            sx={{ color: "primary.main" }}
          />
          <Typography
            variant="span"
            sx={{
              color: "primary.main",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Trello
          </Typography>
        </Box>
        <WorkSpaces />
        <Recent />
        <Starred />
        <Templates />
        <Button variant="outlined">create</Button>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search..."
          type="search"
          size="small"
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="secondary" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>
        <Tooltip title="Notification">
          <HelpOutlineIcon sx={{ cursor: "pointer" }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;