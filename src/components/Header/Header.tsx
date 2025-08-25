import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  ArrowDropDown as ArrowDropDownIcon,
  MusicNote as MusicNoteIcon,
  MusicOff as MusicOffIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  PushPin as PushPinIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigation } from '../../utils/useNavigation';
import { getUser } from '../../utils/getUser';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Header() {
  const { navigateTo } = useNavigation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isDrawerPinned, setIsDrawerPinned] = useState(false);

  const user = getUser();
  const isAuthenticated = !!user.user_id;

  const publicNavItems = [
    { text: 'Главная', path: '/', icon: <HomeIcon /> },
    { text: 'Новости', path: '/news', icon: <InfoIcon /> },
    { text: 'О нас', path: '/about', icon: <InfoIcon /> },
    { text: 'Документация', path: '/documentation', icon: <InfoIcon /> },
  ];

  const privateNavItems = isAuthenticated
    ? [
        { text: 'Навыки', path: '/skills', icon: <InfoIcon /> },
        { text: 'Работники', path: '/candidates', icon: <PeopleIcon /> },
        { text: 'Разделы', path: '/sections', icon: <InfoIcon /> },
      ]
    : [];

  const drawerNavItems = [...publicNavItems, ...privateNavItems];

  const accountItems = isAuthenticated
    ? [
        { text: 'Профиль', path: '/profile', icon: <PersonIcon /> },
        { text: 'Настройки', path: '/settings', icon: <SettingsIcon /> },
        { text: 'Выйти', path: '/logout', icon: <ExitToAppIcon />, onClick: () => {
            localStorage.clear();
            navigateTo('/');
          }
        },
      ]
    : [];

  useEffect(() => {
    if (isMobile && isDrawerPinned) {
      setIsDrawerPinned(false);
    }
  }, [isMobile, isDrawerPinned]);

  useEffect(() => {
    audioRef.current = new Audio('/static/audio/background-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.warn('Автовоспроизведение запрещено:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const toggleDrawer = () => {
    if (isDrawerPinned) return;
    setOpenDrawer(!openDrawer);
  };

  const togglePinDrawer = () => {
    setIsDrawerPinned(!isDrawerPinned);
    if (!isDrawerPinned) setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    if (!isDrawerPinned) setOpenDrawer(false);
  };

  const handleProfileRedirect = () => {
    if (!isAuthenticated) navigateTo('/');
    else navigateTo('/profile');
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigateTo('/')}
          >
            PanCompany
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {drawerNavItems.map(item => (
                <Button key={item.path} color="inherit" onClick={() => navigateTo(item.path)} sx={{ mx: 0.5 }}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <IconButton color="inherit" onClick={toggleMusic} title="Музыка" sx={{ ml: 1 }}>
            {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
          </IconButton>

          {isAuthenticated && (
            <>
              <IconButton
                size="large"
                color="inherit"
                aria-label="account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ ml: 1 }}
              >
                <AccountCircleIcon />
                <ArrowDropDownIcon fontSize="small" />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {accountItems.map(item => (
                  <MenuItem
                    key={item.path}
                    onClick={() => {
                      item.onClick ? item.onClick() : navigateTo(item.path);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDrawerPinned ? 'persistent' : 'temporary'}
        open={openDrawer}
        onClose={handleDrawerClose}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <DrawerHeader>
          <IconButton onClick={togglePinDrawer}>
            <PushPinIcon color={isDrawerPinned ? 'primary' : 'disabled'} />
          </IconButton>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <List>
          {drawerNavItems.map(item => (
            <ListItem
              key={item.path}
              onClick={() => { navigateTo(item.path); handleDrawerClose(); }}
              sx={{ '&:hover': { backgroundColor: theme.palette.action.hover }, cursor: 'pointer' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {isAuthenticated && (
          <>
            <Divider />
            <List>
              {accountItems.map(item => (
                <ListItem
                  key={item.path}
                  onClick={() => { item.onClick ? item.onClick() : navigateTo(item.path); handleDrawerClose(); }}
                  sx={{ '&:hover': { backgroundColor: theme.palette.action.hover }, cursor: 'pointer' }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Drawer>
    </>
  );
}
