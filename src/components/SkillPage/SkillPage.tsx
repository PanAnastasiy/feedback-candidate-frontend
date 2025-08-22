import React, { useState, useEffect } from 'react';
import SkillTable from './SkillTable/SkillTable';
import { Skill } from '../../types/Skill';
import {
  getAllSkills,
  updateSkill,
  deleteSkill,
  createSkill,
} from '../../api/skills';
import { SnackbarMessage } from '../SnackBarMessage/SnackBarMessage';
import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Loading } from '../Loading/Loading'; // ✅ Импорт компонента загрузки

const SkillPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({ name: '', category: '' });
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  }>();
  const [loading, setLoading] = useState(true); // ✅ состояние загрузки

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        setSkills(data);
      } catch (error) {
        setNotification({ message: 'Ошибка загрузки скиллов', type: 'error' });
      } finally {
        setLoading(false); // ✅ выключаем индикатор
      }
    };
    fetchSkills();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) {
      setNotification({ message: 'Все поля обязательны', type: 'error' });
      return;
    }
    try {
      const created = await createSkill(newSkill);
      setSkills(prev => [...prev, created]);
      setNewSkill({ name: '', category: '' });
      setNotification({ message: 'Скилл добавлен', type: 'success' });
    } catch (e: any) {
      setNotification({ message: e.message || 'Ошибка при добавлении', type: 'error' });
    }
  };

  const handleEdit = async (id: number, updated: Omit<Skill, 'id'>) => {
    try {
      const res = await updateSkill(id, updated);
      setSkills(prev => prev.map(s => s.id === id ? res : s));
      setNotification({ message: 'Скилл обновлён', type: 'success' });
    } catch (e: any) {
      setNotification({ message: e.message || 'Ошибка при обновлении', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      setNotification({ message: 'Скилл удалён', type: 'success' });
    } catch (e: any) {
      setNotification({ message: e.message || 'Ошибка при удалении', type: 'error' });
    }
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #e0f7fa, #e3f2fd)',
        py: 4,
      }}
    >
      <Loading open={loading} /> {/* ✅ Отображение загрузки */}

      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            color="primary"
            gutterBottom
            sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
          >
            🌟 Управление Скиллами
          </Typography>
        </motion.div>

        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <SkillTable
            skills={skills}
            newSkill={newSkill}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onInputChange={handleInputChange}
          />
        </Paper>

        <SnackbarMessage
          notification={notification}
          handleClose={() => setNotification(undefined)}
        />
      </Container>
    </Box>
  );
};

export default SkillPage;
