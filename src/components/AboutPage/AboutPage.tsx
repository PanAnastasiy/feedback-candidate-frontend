import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, Variants } from 'framer-motion';

// Типизированный вариант с поддержкой custom index
const cardAnimation: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: custom * 0.25,
            duration: 0.6,
            ease: [0.42, 0, 0.58, 1], // заменяет 'easeOut'
        },
    }),
};

const imageAnimation: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1.8, ease: [0.42, 0, 0.58, 1] }, // заменяет 'easeInOut'
    },
};

export default function AboutPage() {
    const theme = useTheme();

    const cards = [
        {
            title: 'Наша миссия',
            text: 'Создавать технологии, которые улучшают жизнь миллионов пользователей каждый день.',
        },
        {
            title: 'Наши ценности',
            text: 'Прозрачность, инновации и страсть к решению сложных задач — основа нашей работы.',
        },
        {
            title: 'Наша команда',
            text: 'Опытные специалисты из разных сфер объединены идеей изменить цифровой мир.',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
                py: 8,
                px: 2,
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.primary.dark,
                        mb: 4,
                    }}
                >
                    О нашей компании
                </Typography>

                <Typography
                    variant="body1"
                    align="center"
                    paragraph
                    sx={{ maxWidth: '700px', mx: 'auto' }}
                >
                    Мы создаём инновационные решения для настоящего и будущего. Технологии должны быть не только эффективными, но и красивыми.
                </Typography>

                {/* Карточки */}
                <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                    {cards.map((card, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <motion.div
                                custom={i}
                                variants={cardAnimation}
                                initial="hidden"
                                animate="visible"
                            >
                                <Card
                                    sx={{
                                        height: '300px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#fff',
                                        borderRadius: 3,
                                        boxShadow: 4,
                                        p: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.text}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                {/* Изображение и текст */}
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <motion.img
                        src="/static/images/about.jpg"
                        alt="Офис"
                        variants={imageAnimation}
                        initial="hidden"
                        animate="visible"
                        style={{
                            width: '100%',
                            maxWidth: '800px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                    />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Вдохновляющая среда — источник наших лучших решений.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
