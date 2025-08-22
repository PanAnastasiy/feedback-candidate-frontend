import React, { useState } from 'react';
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Paper, IconButton, TextField,
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Box, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Skill } from '../../../types/Skill';

interface Props {
    skills: Skill[];
    newSkill: Omit<Skill, 'id'>;
    onEdit: (id: number, updated: Omit<Skill, 'id'>) => void;
    onDelete: (id: number) => void;
    onAdd: (newSkill: Omit<Skill, 'id'>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SkillTable: React.FC<Props> = ({
    skills,
    newSkill,
    onEdit,
    onDelete,
    onAdd,
    onInputChange
}) => {
    const [editMode, setEditMode] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);
    const [editedSkill, setEditedSkill] = useState<Omit<Skill, 'id'>>({ name: '', category: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [skillIdToDelete, setSkillIdToDelete] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditClick = (skill: Skill) => {
        setEditMode(skill.id);
        setEditedSkill({ name: skill.name, category: skill.category });
    };

    const handleAddClick = () => setAdding(true);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedSkill(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = (id: number) => {
        onEdit(id, editedSkill);
        setEditMode(null);
    };

    const handleAddSave = () => {
        if (!newSkill.name.trim() || !newSkill.category.trim()) return;
        onAdd(newSkill);
        setAdding(false);
    };

    const handleCancel = () => {
        setEditMode(null);
        setAdding(false);
    };

    const handleOpenDialog = (id: number) => {
        setSkillIdToDelete(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSkillIdToDelete(null);
    };

    const handleDelete = (id: number) => {
        if (id !== null) {
            onDelete(id);
            setOpenDialog(false);
        }
    };

    return (
        <>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <WorkOutlineIcon fontSize="large" color="primary" />
                <Box>
                    <TextField
                        label="Поиск по названию/категории"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        size="small"
                        fullWidth
                    />
                    <Box mt={1}><strong>Всего навыков:</strong> {skills.length}</Box>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Название навыка</TableCell>
                            <TableCell>Категория</TableCell>
                            <TableCell align="right">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSkills.map(skill => (
                            <TableRow key={skill.id}>
                                <TableCell>{skill.id}</TableCell>
                                {editMode === skill.id ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="name"
                                                value={editedSkill.name}
                                                onChange={handleEditChange}
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="category"
                                                value={editedSkill.category}
                                                onChange={handleEditChange}
                                                size="small"
                                                fullWidth
                                            />
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>{skill.name}</TableCell>
                                        <TableCell>{skill.category}</TableCell>
                                    </>
                                )}
                                <TableCell align="right">
                                    {editMode === skill.id ? (
                                        <>
                                            <Tooltip title="Сохранить">
                                                <IconButton color="success" onClick={() => handleSaveClick(skill.id)}>
                                                    <SaveIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Отмена">
                                                <IconButton color="error" onClick={handleCancel}>
                                                    <CancelIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    ) : (
                                        <>
                                            <Tooltip title="Редактировать">
                                                <IconButton color="primary" onClick={() => handleEditClick(skill)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton color="error" onClick={() => handleOpenDialog(skill.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {adding ? (
                            <TableRow>
                                <TableCell>—</TableCell>
                                <TableCell>
                                    <TextField
                                        name="name"
                                        value={newSkill.name}
                                        onChange={onInputChange}
                                        size="small"
                                        fullWidth
                                        placeholder="Название"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="category"
                                        value={newSkill.category}
                                        onChange={onInputChange}
                                        size="small"
                                        fullWidth
                                        placeholder="Категория"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Сохранить">
                                        <IconButton color="success" onClick={handleAddSave}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Отмена">
                                        <IconButton color="error" onClick={handleCancel}>
                                            <CancelIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow hover onClick={handleAddClick} sx={{ cursor: 'pointer', backgroundColor: '#f9f9f9', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell colSpan={4} align="center">
                                    <AddIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    <span style={{ fontStyle: 'italic', color: '#555' }}>
                                        Добавить новый навык
                                    </span>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    Вы уверены, что хотите удалить этот навык?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={() => handleDelete(skillIdToDelete!)} color="error">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SkillTable;
