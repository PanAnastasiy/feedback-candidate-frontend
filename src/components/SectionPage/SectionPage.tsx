// SectionPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, TextField, Button, Typography, Paper, IconButton, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { SnackbarMessage } from '../SnackBarMessage/SnackBarMessage';
import { Section } from '../../types/Section';
import {
  createSection,
  deleteSection,
  getAllSections,
  updateSection,
} from '../../api/sections';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Loading } from '../Loading/Loading';

const PageLayout = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '24px',
  padding: '32px',
  maxWidth: '1400px',
  margin: '0 auto',
}));

const CardGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '20px',
  maxHeight: '80vh',
  overflowY: 'auto',
  paddingRight: '8px',
}));

const SectionCard = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(3),
  height: '220px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '16px',
  backgroundColor: '#fce4ec',
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
  const [sections, setSections] = useState<Section[]>([]);
  const [newSection, setNewSection] = useState<Omit<Section, 'id'>>({ name: '', description: '' });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' }>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllSections();
        setSections(data);
      } catch {
        setNotification({ message: 'Ошибка загрузки разделов', type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSection(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = useCallback(async () => {
    if (!newSection.name.trim()) {
      setNotification({ message: 'Название обязательно!', type: 'error' });
      return;
    }

    try {
      const created = await createSection({
        name: newSection.name.trim(),
        description: newSection.description.trim(),
      });

      setSections(prev => [...prev, created]);
      setNewSection({ name: '', description: '' });
      setNotification({ message: 'Раздел добавлен', type: 'success' });
    } catch (error: any) {
      setNotification({ message: error.message || 'Ошибка при добавлении', type: 'error' });
    }
  }, [newSection]);

  const handleDelete = async (id: number) => {
    try {
      await deleteSection(id);
      setSections(prev => prev.filter(t => t.id !== id));
      setNotification({ message: 'Удалено', type: 'success' });
    } catch {
      setNotification({ message: 'Ошибка удаления', type: 'error' });
    }
  };

  const handleEdit = async () => {
    if (editingId === null) return;
    try {
      const updated = await updateSection(editingId, newSection);
      setSections(prev =>
        prev.map(t => (t.id === editingId ? updated : t))
      );
      setEditingId(null);
      setNewSection({ name: '', description: '' });
      setNotification({ message: 'Обновлено', type: 'success' });
    } catch {
      setNotification({ message: 'Ошибка обновления', type: 'error' });
    }
  };

  const startEditing = (section: Section) => {
    setEditingId(section.id);
    setNewSection({ name: section.name, description: section.description });
  };

  if (loading) return <Loading open={true} />;

  return (
    <Box sx={{ background: 'linear-gradient(to right, #e0f7fa, #fce4ec)', minHeight: '100vh' }}>
      <PageLayout>
        <CardGrid>
          {sections.map((section, i) => (
            <SectionCard
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Typography variant="h6">{section.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {section.description || 'Нет описания'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton size="small" color="primary" onClick={() => startEditing(section)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(section.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </SectionCard>
          ))}
        </CardGrid>

        <SidePanel elevation={3}>
          <Typography variant="h6" display="flex" alignItems="center" gap={1} gutterBottom>
            <AddIcon fontSize="small" />
            {editingId ? 'Редактировать раздел' : 'Добавить раздел'}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField
            label="Название"
            name="name"
            value={newSection.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Описание"
            name="description"
            value={newSection.description}
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
                setNewSection({ name: '', description: '' });
              }}
            >
              Отменить
            </Button>
          )}
        </SidePanel>
      </PageLayout>

      <SnackbarMessage
        notification={notification}
        handleClose={() => setNotification(undefined)}
      />
    </Box>
  );
};

export default SectionPage;
