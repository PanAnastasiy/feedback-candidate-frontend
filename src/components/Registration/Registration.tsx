import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../../api/authorization";
import { SnackbarMessage } from "../SnackBarMessage/SnackBarMessage";
import { useNavigate } from "react-router-dom";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const Registration: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '', repeatPassword: '' });
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const handleCloseNotification = () => setNotification(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const res = await login({ email: formData.email, password: formData.password });
      if (res.error) {
        setNotification({ message: res.error || "Ошибка авторизации", type: "error" });
      } else {
        setNotification({ message: "Вход выполнен успешно!", type: "success" });
        setTimeout(() => navigate("/candidates"), 1000);
      }
    } else {
      if (formData.password !== formData.repeatPassword) {
        setNotification({ message: "Пароли не совпадают", type: "error" });
        return;
      }
      if (formData.password.length < 6) {
        setNotification({ message: "Пароль должен быть не менее 6 символов", type: "error" });
        return;
      }

      const res = await register({
        email: formData.email,
        username: formData.username || formData.email,
        password: formData.password,
      });
      if (res.error) {
        setNotification({ message: res.error || "Ошибка регистрации", type: "error" });
      } else {
        setNotification({ message: "Регистрация прошла успешно! Пожалуйста, авторизуйтесь.", type: "success" });
        setIsLogin(true);
        setFormData({ ...formData, repeatPassword: '' });
      }
    }
  };

  return (
      <>
    <Box display="flex" minHeight="100vh">
      {/* Левая колонка: форма */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center" sx={{ bgcolor: 'rgb(144, 196, 245)' }}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            width: 400,
            height: 550,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box textAlign="center" mb={2}>
            <Avatar sx={{ m: '0 auto', bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {isLogin ? 'Добро пожаловать' : 'Создайте аккаунт'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isLogin ? 'Введите данные для входа' : 'Заполните поля для регистрации'}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {!isLogin && (
                  <TextField
                    label="Имя"
                    name="username"
                    fullWidth
                    margin="dense"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                )}
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  margin="dense"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Пароль"
                  name="password"
                  type="password"
                  fullWidth
                  margin="dense"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  error={!isLogin && formData.password !== '' && formData.password.length < 6}
                  helperText={!isLogin && formData.password !== '' && formData.password.length < 6 ? "Пароль должен быть не менее 6 символов" : ''}
                />
                {!isLogin && (
                  <TextField
                    label="Повторите пароль"
                    name="repeatPassword"
                    type="password"
                    fullWidth
                    margin="dense"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                    required
                    error={formData.repeatPassword !== '' && formData.password !== formData.repeatPassword}
                    helperText={formData.repeatPassword !== '' && formData.password !== formData.repeatPassword ? "Пароли не совпадают" : ''}
                  />
                )}

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  startIcon={isLogin ? <LoginIcon /> : <AppRegistrationIcon />}
                  sx={{ mt: 3 }}
                  disabled={loading || (!isLogin && (formData.password !== formData.repeatPassword || formData.password.length < 6))}
                >
                  {loading ? <CircularProgress size={24} /> : isLogin ? 'Войти' : 'Зарегистрироваться'}
                </Button>

                <Button onClick={() => setIsLogin(!isLogin)} sx={{ mt: 1 }} fullWidth>
                  {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                </Button>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Paper>
      </Box>

      {/* Правая колонка: фоновое изображение и цитата */}
      <Box
        flex={1}
        sx={{
          position: 'relative',
          backgroundImage: 'url(/static/images/auth-back.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: 4,
          }}
        >
          <Box maxWidth={500}>
            <Typography
              variant="h4"
              color="white"
              fontWeight={600}
              textAlign="center"
              gutterBottom
              sx={{ fontStyle: 'italic', lineHeight: 1.4 }}
            >
              “Каждое великое начинание требует первого шага. Сегодня ты уже ближе к цели.”
            </Typography>
            <Typography variant="subtitle1" color="white" textAlign="center" mt={2}>
              — Ген. директор PanCompany
            </Typography>
          </Box>
        </Box>
      </Box>

      </Box>
       {/* Snackbar поверх всего */}
      <SnackbarMessage
        notification={notification || undefined}
        handleClose={handleCloseNotification}
      />
    </>
  );
};

export default Registration;

