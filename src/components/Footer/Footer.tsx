import React from "react";

import { Box, Typography, Link, IconButton, Divider, Grid } from '@mui/material';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';

const Footer: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#333',
                color: 'white',
                padding: '20px',
            }}
        >
            <Divider sx={{ marginBottom: '20px' }} />
            <Grid container spacing={4}>
                {/* Социальные сети */}
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                        Социальные сети
                    </Typography>
                    <Box>
                        <IconButton
                            component={Link}
                            href="https://facebook.com"
                            target="_blank"
                            sx={{ color: 'white', marginRight: '10px' }}
                        >
                            <Facebook />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="https://twitter.com"
                            target="_blank"
                            sx={{ color: 'white', marginRight: '10px' }}
                        >
                            <Twitter />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="https://linkedin.com"
                            target="_blank"
                            sx={{ color: 'white', marginRight: '10px' }}
                        >
                            <LinkedIn />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="https://github.com"
                            target="_blank"
                            sx={{ color: 'white', marginRight: '10px' }}
                        >
                            <GitHub />
                        </IconButton>
                    </Box>
                </Grid>

                {/* Лицензия */}
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                        Лицензия
                    </Typography>
                    <Typography variant="body2">
                        Программное обеспечение предоставляется под лицензией MIT.
                    </Typography>
                </Grid>

                {/* Полезные ссылки */}
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                        Полезные ссылки
                    </Typography>
                    <Box>
                        <Link href="/about" color="inherit" sx={{ display: 'block', marginBottom: '8px' }}>
                            О нас
                        </Link>
                        <Link href="/contact" color="inherit" sx={{ display: 'block', marginBottom: '8px' }}>
                            Контакты
                        </Link>
                        <Link href="/privacy" color="inherit" sx={{ display: 'block', marginBottom: '8px' }}>
                            Политика конфиденциальности
                        </Link>
                    </Box>
                </Grid>

                {/* Контакты */}
                <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                        Контакты
                    </Typography>
                    <Typography variant="body2">Email: pan@company.com</Typography>
                    <Typography variant="body2">Телефон: +375 (29) 237-425-05</Typography>
                </Grid>
            </Grid>

            {/* Копирайт */}
            <Divider sx={{ marginTop: '20px' }} />
            <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
                <Typography variant="body2">
                    © {new Date().getFullYear()} Все права защищены.
                </Typography>
            </Box>
        </Box>
    );
};

export default Footer;

