import { Outlet, Link } from "react-router-dom";
import React, { useContext, useEffect } from 'react';

import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { AuthContext } from '../shared/context/auth-context';
import { useNavigate } from 'react-router-dom';

import GridViewIcon from '@mui/icons-material/GridView';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import LogoutIcon from '@mui/icons-material/Logout';

import { useLocation } from 'react-router-dom'




const drawerWidth = 240;

const Layout = (props) => {

  const location = useLocation();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  console.log(location.pathname);

const auth = useContext(AuthContext);
const navigate = useNavigate();

useEffect(() => {
  window.addEventListener("beforeunload", alertUser);
  checkBeforeRefreshRoute();

  return () => {
    window.removeEventListener("beforeunload", alertUser);
  };

}, [window]);

const checkBeforeRefreshRoute = () => {
  const lastRoute = localStorage.getItem("lastRoute");
  if(lastRoute ){
    localStorage.removeItem("lastRoute");
    navigate(lastRoute);


  }
}



const alertUser = (e) => {
  e.preventDefault();
  e.returnValue = "";
  console.log(location.pathname);
  localStorage.setItem("lastRoute",location.pathname)
};




  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const listItemHandler = (option) => {
    if (option == "Logout"){
      auth.logout();
    }
    else if(option == "Quiz Manager"){
      
      navigate('/quiz-manager');
    }
    else if(option == "Dashboard"){
      
      navigate('/');
    }
    else if(option == "Doubts"){
      
      navigate('/doubt');
    }
  }

  const getSideBarItems = () => {
    if(auth.email == "rahul@mogiio.com"){
      return ['Dashboard', 'Doubts', 'Quiz Manager', 'Logout'];
    }
    return ['Dashboard', 'Logout']
  }

  const getPageTitle = () => {
   if(location.pathname == "/"){
    return 'Dashboard';
   }
   else if(location.pathname.includes("/quiz-manager")){
    return 'Quiz Manager';
   }
   else if(location.pathname.includes("/doubt")){
    return 'Doubts';
   }
  }

  const getIcon = (tabName) => {
    if(tabName == "Dashboard") return <GridViewIcon />;
    if(tabName == "Doubts") return <PsychologyAltIcon />;
    if(tabName == "Quiz Manager") return <DocumentScannerIcon />;
    if(tabName == "Logout") return <LogoutIcon />;
  }

  const drawer = (
    <div>
      <Toolbar >
       
        {/* <img
        src="https://cdn6.mogiio.com/623c167b8799a500089abd4b/2023/07/03/insideWebAppLogo/GCinapplogo.png"
        srcSet="https://cdn6.mogiio.com/623c167b8799a500089abd4b/2023/07/03/insideWebAppLogo/GCinapplogo.png"
        alt="Green Coder"
        loading="lazy"
        style={{width: 70}}
      /> */}
     <Typography variant="h6" noWrap component="div">Green Coder</Typography>
        </Toolbar>
      
      <Divider />
      <List>
        {getSideBarItems().map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={()=>{listItemHandler(text);}}>
              <ListItemIcon>
                {getIcon(text)}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
    </div>
  );

  const container =  undefined;

  return (
    <>
    {(location.pathname.includes('/quiz/') || location.pathname.includes('/report/')) && <Outlet /> }
    {!(location.pathname.includes('/quiz/') || location.pathname.includes('/report/'))  && (<Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>) }
    </>
    
  );


};

export default Layout;