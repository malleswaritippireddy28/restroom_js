import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Room from "@mui/icons-material/Room";
import { Link, useNavigate, redirect } from "react-router-dom";
import { getToken, logout } from "../utilities/utility";

function Home(props) {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [token, setToken] = React.useState(getToken());

  const [pages, setPages] = React.useState([
    { name: "Home", url: "/" },
    { name: "Add Room", url: "/addroom", isAdmin: true },
    { name: "Maps", url: "/map", isAdmin: true },
  ]);
  const settings = [
    { name: "Profile", url: "/" },
    { name: "Account", url: "/" },
    { name: "Dashboard", url: "/" },
    { name: "Logout", url: "/login" },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (url) => {
    setAnchorElNav(null);
    try {
      if (url) {
        if (url === "/login") {
          logout();
          return;
        }
        navigate(url);
      }
    } catch (e) {}
  };

  React.useEffect(() => {
    if (!token) setToken(getToken());
    console.log(getToken());
  }, [localStorage]);

  const handleCloseUserMenu = async (url) => {
    setAnchorElUser(null);
    try {
      if (url) {
        if (url === '/login') {
          await logout();
          navigate('/login');
        } else {
          navigate(url);
        }
      }
    } catch (error) {
      console.error('Error handling user menu:', error);
    }
  };

  return (
    <>
      {getToken() && (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Room sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                onClick={() => navigate("/")}
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Rest Roomzz
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => {
                    if (page?.isAdmin) {
                      return getToken().isAdmin ? (
                        <Link to={page.url}>
                          <MenuItem
                            key={page}
                            onClick={() => handleCloseNavMenu(page.url)}
                          >
                            <Typography textAlign="center">
                              {page.name}
                            </Typography>
                          </MenuItem>
                        </Link>
                      ) : (
                        <></>
                      );
                    }
                    return (
                      <Link to={page.url}>
                        <MenuItem
                          key={page}
                          onClick={() => handleCloseNavMenu(page.url)}
                        >
                          <Typography textAlign="center">
                            {page.name}
                          </Typography>
                        </MenuItem>
                      </Link>
                    );
                  })}
                </Menu>
              </Box>
              <Room sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                onClick={() => navigate("/")}
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Rest Roomzz
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => {
                  if (page?.isAdmin) {
                    return getToken().isAdmin ? (
                      <Button
                        key={page.name}
                        onClick={() => handleCloseNavMenu(page.url)}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        {page.name}
                      </Button>
                    ) : (
                      <></>
                    );
                  }
                  return (
                    <Button
                      key={page.name}
                      onClick={() => handleCloseNavMenu(page.url)}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page.name}
                    </Button>
                  );
                })}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={() => handleCloseUserMenu(setting.url)}
                    >
                      <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
      <main className="mainWrapper">{props.children}</main>
    </>
  );
}
export default Home;
