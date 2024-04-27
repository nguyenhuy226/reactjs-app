import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatter";
export default function BoardBar({ board }) {
  const MENU_STYLE = {
    color: "white",
    bgcolor: "transparent",
    border: "none",
    paddingX: "5px",
    borderRadius: "4px",
    "& .MuiSvgIcon-root ": {
      color: "white",
    },
    "&:hover": {
      bgcolor: "primary.50",
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
        paddingX: 2,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<AddToDriveIcon />}
          label="Add To Google Driver"
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<BoltIcon />}
          label="Automation"
          clickable
          sx={MENU_STYLE}
        />
        <Chip
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          sx={MENU_STYLE}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={6}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: 16,
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { bgcolor: "#a4b0be" },
            },
          }}
        >
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
          <Tooltip title="Nguyenhuydev">
            <Avatar
              alt="Nguyenhuydev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-1/210010484_3063243800574743_2380137577466830535_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGl9MBpOUQ_ALOhJLjsC-cerRD8Wqz9qnitEPxarP2qeL8-S3pq6a-_ZhuwYQsecOwNlVtreJYl0vMJThn_KK1r&_nc_ohc=j-qKX5adv5wAb4cJpsL&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfB-PMtZ3uwyZlbv3PpCfvb7gBoo1lVkrRhgd_q79f3Xng&oe=664FDB47"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}
