import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, TextField, Button, Typography, Paper, IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { SnackbarMessage } from '../SnackBarMessage/SnackBarMessage';
import { Skill } from '../../types/Skill';
import {
    createSkill,
    deleteSkill,
    getAllSkills,
    updateSkill,
} from '../../api/skills';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PageLayout = styled(Box)({
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
});

const CardGrid = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    maxHeight: '80vh',
    overflowY: 'auto',
    paddingRight: '8px',
});

const TechCard = styled(motion(Paper))(({ theme }) => ({
    padding: theme.spacing(3),
    height: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '16px',
    backgroundColor: '#e3f2fd',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
    },
}));

const SidePanel = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: '16px',
    backgroundColor: '#f4f6f8',
    height: 'fit-content',
    position: 'sticky',
    top: '32px',
}));

const SectionPage: React.FC = () => {
    const [technologies, setTechnologies] = useState<Skill[]>([]);
    const [newTech, setNewTech] = useState<Omit<Skill, 'id'>>({ name: '', category: '' });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' }>();
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllSkills();
                setTechnologies(data);
            } catch {
                setNotification({ message: 'Ошибка загрузки технологий', type: 'error' });
            }
        })();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTech(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAdd = useCallback(async () => {
        const normalizedName = newTech.name.trim().toLowerCase();

        if (!normalizedName) {
            setNotification({
                message: 'Название технологии обязательно для заполнения!',
                type: 'error',
            });
            return;
        }

        const isDuplicate = technologies.some(
            tech => tech.name.trim().toLowerCase() === normalizedName
        );

        if (isDuplicate) {
            setNotification({
                message: 'Технология с таким названием уже существует!',
                type: 'error',
            });
            return;
        }

        try {
            const created = await createSkill({
                name: newTech.name.trim(),
                category: newTech.category.trim()
            });

            setTechnologies(prev => [...prev, created]);
            setNewTech({ name: '', category: '' });
            setNotification({
                message: 'Технология успешно добавлена!',
                type: 'success',
            });
        } catch (error: any) {
            setNotification({
                message: error.message || 'Ошибка при добавлении технологии',
                type: 'error',
            });
        }
    }, [newTech, technologies]);


    const handleDelete = async (id: number) => {
        try {
            await deleteSkill(id);
            setTechnologies(prev => prev.filter(t => t.id !== id));
            setNotification({ message: 'Удалено', type: 'success' });
        } catch {
            setNotification({ message: 'Ошибка удаления', type: 'error' });
        }
    };

    const handleEdit = async () => {
        if (editingId === null) return;
        try {
            const updated = await updateSkill(editingId, newTech);
            setTechnologies(prev =>
                prev.map(t => (t.id === editingId ? updated : t))
            );
            setEditingId(null);
            setNewTech({ name: '', category: '' });
            setNotification({ message: 'Обновлено', type: 'success' });
        } catch {
            setNotification({ message: 'Ошибка обновления', type: 'error' });
        }
    };

    const startEditing = (tech: Skill) => {
        setEditingId(tech.id);
        setNewTech({ name: tech.name, category: tech.category });
    };

    return (
        <PageLayout>
            <CardGrid>
                {technologies.map((tech, i) => (
                    <TechCard
                        key={tech.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                        <Typography variant="h6">{tech.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {tech.category || 'Нет описания'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <IconButton size="small" color="primary" onClick={() => startEditing(tech)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(tech.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </TechCard>
                ))}
            </CardGrid>

            <SidePanel elevation={3}>
                <Typography variant="h6" gutterBottom>
                    {editingId ? 'Редактировать технологию' : 'Добавить технологию'}
                </Typography>
                <TextField
                    label="Название"
                    name="name"
                    value={newTech.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Описание"
                    name="description"
                    value={newTech.category}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={editingId ? handleEdit : handleAdd}
                >
                    {editingId ? 'Сохранить' : 'Добавить'}
                </Button>
                {editingId && (
                    <Button
                        fullWidth
                        sx={{ mt: 1 }}
                        onClick={() => {
                            setEditingId(null);
                            setNewTech({ name: '', category: '' });
                        }}
                    >
                        Отменить
                    </Button>
                )}
            </SidePanel>

            <SnackbarMessage
                notification={notification}
                handleClose={() => setNotification(undefined)}
            />
        </PageLayout>
    );
};

export default SectionPage;
