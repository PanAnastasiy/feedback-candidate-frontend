// CandidatePage.tsx
import React, { useState, useEffect } from 'react';
import { Candidate, CandidateCreate } from '../../types/Candidate';
import { CandidateStatus } from '../../types/CandidateStatus';
import {
    getAllCandidates,
    createCandidate,
    updateCandidate,
    deleteCandidate,
} from '../../api/candidate';
import { getCandidateStatuses } from '../../api/status';
import { styled } from '@mui/material/styles';
import { motion, easeInOut } from 'framer-motion';

import { SnackbarMessage } from '../SnackBarMessage/SnackBarMessage';
import CandidateTable from './CandidateTable/CandidateTable';

import { Loading } from '../Loading/Loading';
import {
    SelectChangeEvent,
    Typography,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TextField,
    Stack
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PageContainer = styled('div')({
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    padding: '32px',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #e3f2fd, #fce4ec)',
});

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: easeInOut } },
};

const COLORS = ['#1976d2', '#ff9800', '#4caf50', '#9c27b0', '#f44336', '#00acc1'];

const CandidatePage: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [statuses, setStatuses] = useState<CandidateStatus[]>([]);
    const [newCandidate, setNewCandidate] = useState<CandidateCreate>({
        fullname: '',
        email: '',
        position: '',
        status: '',
    });
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    }>();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [candidatesData, statusesData] = await Promise.all([
                    getAllCandidates(),
                    getCandidateStatuses(),
                ]);
                setCandidates(candidatesData);
                setStatuses(statusesData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setNotification({ message: 'Ошибка загрузки данных', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCandidate((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        if (name) {
            setNewCandidate((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAdd = async () => {
        if (!newCandidate.fullname || !newCandidate.email || !newCandidate.position || !newCandidate.status) {
            setNotification({ message: 'Заполните все поля', type: 'error' });
            return;
        }

        try {
            const created = await createCandidate(newCandidate);
            setCandidates([...candidates, created]);
            setNewCandidate({ fullname: '', email: '', position: '', status: '' });
            setNotification({ message: 'Кандидат успешно добавлен', type: 'success' });
        } catch (e: any) {
            setNotification({ message: e.message || 'Ошибка при добавлении', type: 'error' });
        }
    };

    const handleEdit = async (id: number, data: CandidateCreate) => {
        try {
            await updateCandidate(id, data);
            const updatedCandidates = await getAllCandidates();
            setCandidates(updatedCandidates);
            setNotification({ message: `Кандидат №${id} обновлён`, type: 'success' });
        } catch (e: any) {
            setNotification({ message: e.message, type: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCandidate(id);
            setCandidates(candidates.filter((c) => c.id !== id));
            setNotification({ message: `Кандидат №${id} удалён`, type: 'success' });
        } catch (e: any) {
            setNotification({ message: e.message, type: 'error' });
        }
    };

    const filteredCandidates = candidates.filter((c) => {
        const matchesStatus = selectedStatus ? c.status === selectedStatus : true;
        const matchesSearch = `${c.fullname} ${c.email}`.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const chartData = statuses.map((status) => ({
        name: status.name,
        value: candidates.filter((c) => c.status === status.name).length,
    }));

    return (
        <>
            <Loading open={loading} />
            {!loading && (
                <PageContainer>
                    <motion.div initial="hidden" animate="visible" variants={fadeIn} style={{ width: '100%', maxWidth: '850px', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                        <h1 style={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center' }}>Список кандидатов</h1>
                        <CandidateTable
                            candidates={filteredCandidates}
                            newCandidate={newCandidate}
                            statuses={statuses}
                            onAdd={handleAdd}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onInputTextChange={handleInputTextChange}
                            onInputSelectChange={handleInputSelectChange}
                            onHoverCandidate={() => {}}
                        />
                    </motion.div>

                    <Box sx={{ flex: 1, maxWidth: '320px', position: 'sticky', top: 100, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>Фильтры</Typography>
                            <Stack spacing={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Статус</InputLabel>
                                    <Select
                                        value={selectedStatus}
                                        label="Статус"
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <MenuItem value="">Все</MenuItem>
                                        {statuses.map((s) => (
                                            <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Поиск"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Stack>

                            <Typography variant="h6" gutterBottom mt={3}>Статистика</Typography>
                            {statuses.map((status) => {
                                const count = candidates.filter(c => c.status === status.name).length;
                                return (
                                    <Box key={status.id} display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body2">{status.name}</Typography>
                                        <Typography variant="body2" fontWeight="bold">{count}</Typography>
                                    </Box>
                                );
                            })}

                            {chartData.length > 0 && (
                                <Box mt={3} flex={1}>
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={80}
                                                label
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <SnackbarMessage notification={notification} handleClose={() => setNotification(undefined)} />
                </PageContainer>
            )}
        </>
    );
};

export default CandidatePage;



