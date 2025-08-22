// CandidateTable.tsx
import React, { useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TextField, IconButton, Button,
  Select, MenuItem, Chip, FormControl, Stack, SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { Candidate, CandidateCreate } from '../../../types/Candidate';
import { CandidateStatus } from '../../../types/CandidateStatus';
import { useNavigate } from 'react-router-dom';

const statusColorMap: Record<string, string> = {
  new: '#1976d2',
  in_review: '#ff9800',
  feedback_ready: '#4caf50',
  feedback_sent: '#9c27b0',
};

const statusLabelMap: Record<string, string> = {
  new: 'Новый',
  in_review: 'На рассмотрении',
  feedback_ready: 'Фидбек готов',
  feedback_sent: 'Фидбек отправлен',
};

interface Props {
  candidates: Candidate[];
  newCandidate: CandidateCreate;
  statuses: CandidateStatus[];
  onAdd: () => void;
  onEdit: (id: number, data: CandidateCreate) => void;
  onDelete: (id: number) => void;
  onInputTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputSelectChange: (e: SelectChangeEvent<string>) => void;
  onHoverCandidate: (candidate: Candidate | null) => void;
}

const CandidateTable: React.FC<Props> = ({
  candidates,
  newCandidate,
  statuses,
  onAdd,
  onEdit,
  onDelete,
  onInputTextChange,
  onInputSelectChange,
  onHoverCandidate
}) => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<CandidateCreate>({
    fullname: '',
    email: '',
    position: '',
    status: '',
  });

  const handleEditClick = (candidate: Candidate) => {
    setEditId(candidate.id);
    setEditData({
      fullname: candidate.fullname,
      email: candidate.email,
      position: candidate.position,
      status: candidate.status || '',
    });
  };

  const handleEditTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEdit = () => {
    if (editId !== null) {
      onEdit(editId, editData);
      setEditId(null);
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => a.id - b.id);

  return (
    <div style={{ maxHeight: 600, overflowY: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>ФИО</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Должность</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Дата создания</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCandidates.map((candidate) => (
            <TableRow
              key={candidate.id}
              onMouseEnter={() => onHoverCandidate(candidate)}
              onMouseLeave={() => onHoverCandidate(null)}
              hover
              sx={{ transition: '0.2s', '&:hover': { backgroundColor: '#e3f2fd' } }}
            >
              <TableCell>{candidate.id}</TableCell>
              {editId === candidate.id ? (
                <>
                  <TableCell>
                    <TextField name="fullname" value={editData.fullname} onChange={handleEditTextChange} size="small" />
                  </TableCell>
                  <TableCell>
                    <TextField name="email" value={editData.email} onChange={handleEditTextChange} size="small" />
                  </TableCell>
                  <TableCell>
                    <TextField name="position" value={editData.position} onChange={handleEditTextChange} size="small" />
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <Select name="status" value={editData.status} onChange={handleEditSelectChange}>
                        {statuses.map((status) => (
                          <MenuItem key={status.id} value={status.name}>
                            <Stack direction="row" alignItems="center" gap={1}>
                              <Chip
                                label={statusLabelMap[status.name] || status.name}
                                size="small"
                                style={{
                                  backgroundColor: statusColorMap[status.name] || '#9e9e9e',
                                  color: '#fff',
                                }}
                              />
                              {statusLabelMap[status.name] || status.name}
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{candidate.fullname}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabelMap[candidate.status || ''] || candidate.status || '—'}
                      style={{
                        backgroundColor: statusColorMap[candidate.status || ''] || '#9e9e9e',
                        color: '#fff',
                      }}
                    />
                  </TableCell>
                </>
              )}
              <TableCell>{candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : '-'}</TableCell>
              <TableCell>
                {editId === candidate.id ? (
                  <IconButton onClick={handleSaveEdit}><SaveIcon color="success" /></IconButton>
                ) : (
                  <IconButton onClick={() => handleEditClick(candidate)}><EditIcon color="primary" /></IconButton>
                )}
                <IconButton onClick={() => navigate(`/feedback/${candidate.id}`)}><FeedbackIcon color="info" /></IconButton>
                <IconButton onClick={() => onDelete(candidate.id)}><DeleteIcon color="error" /></IconButton>
              </TableCell>
            </TableRow>
          ))}

          {/* Row for new candidate */}
          <TableRow>
            <TableCell>—</TableCell>
            <TableCell>
              <TextField name="fullname" value={newCandidate.fullname} onChange={onInputTextChange} size="small" label="ФИО" />
            </TableCell>
            <TableCell>
              <TextField name="email" value={newCandidate.email} onChange={onInputTextChange} size="small" label="Email" />
            </TableCell>
            <TableCell>
              <TextField name="position" value={newCandidate.position} onChange={onInputTextChange} size="small" label="Должность" />
            </TableCell>
            <TableCell>
              <FormControl fullWidth size="small">
                <Select name="status" value={newCandidate.status} onChange={onInputSelectChange} displayEmpty>
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.name}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Chip
                          label={statusLabelMap[status.name] || status.name}
                          size="small"
                          style={{
                            backgroundColor: statusColorMap[status.name] || '#9e9e9e',
                            color: '#fff',
                          }}
                        />
                        {statusLabelMap[status.name] || status.name}
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell colSpan={2}>
              <Button onClick={onAdd} startIcon={<SaveIcon />} variant="contained" color="primary" size="small">
                Добавить
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateTable;
