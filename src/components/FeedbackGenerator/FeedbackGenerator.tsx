import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Paper,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Rating,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';

import {
    generateFeedbackForSection,
    getFeedbackByCandidateId,
    saveFinalFeedback,
} from '../../api/feedback';
import { getAllSections } from '../../api/sections';
import { getAllSkills } from '../../api/skills';
import { getCandidateById } from '../../api/candidate';

import { Section as SectionType } from '../../types/Section';
import { Skill } from '../../types/Skill';
import { Candidate } from '../../types/Candidate';

interface SectionSkill {
    skill: Skill;
    level: number;
}

interface Section extends SectionType {
    keywords: string;
    generatedText: string;
    skills: SectionSkill[];
}

const FeedbackGenerator: React.FC = () => {
    const [availableSections, setAvailableSections] = useState<SectionType[]>([]);
    const [allSkills, setAllSkills] = useState<Skill[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [finalFeedback, setFinalFeedback] = useState('');
    const [newSectionId, setNewSectionId] = useState<number | ''>('');
    const { candidateId } = useParams<{ candidateId: string }>();
    const candidateIdNum = Number(candidateId);
    const [candidate, setCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [sectionsRes, skillsRes, candidateRes, feedbackRes] = await Promise.all([
                    getAllSections(),
                    getAllSkills(),
                    getCandidateById(candidateIdNum),
                    getFeedbackByCandidateId(candidateIdNum).catch(() => null),
                ]);

                setAvailableSections(sectionsRes);
                setAllSkills(skillsRes);
                setCandidate(candidateRes);

                if (feedbackRes && feedbackRes.items?.length > 0) {
                    const sectionsMap: Record<number, Section> = {};
                    feedbackRes.items.forEach((item: any) => {
                        const sectionMeta = sectionsRes.find(s => s.id === item.section_id);
                        if (!sectionMeta) return;

                        if (!sectionsMap[item.section_id]) {
                            sectionsMap[item.section_id] = {
                                ...sectionMeta,
                                keywords: '',
                                generatedText: '',
                                skills: [],
                            };
                        }

                        const skill = skillsRes.find((sk: Skill) => sk.id === item.skill_id);
                        if (skill) {
                            sectionsMap[item.section_id].skills.push({ skill, level: item.level });
                        }
                        sectionsMap[item.section_id].generatedText = item.comment || '';
                    });
                    setSections(Object.values(sectionsMap));
                }
            } catch (err) {
                console.error('Ошибка загрузки:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [candidateIdNum]);

    useEffect(() => {
        const updatedFinal = sections.map(s => s.generatedText.trim()).filter(Boolean).join('\n\n');
        setFinalFeedback(updatedFinal);
    }, [sections]);

    const handleGenerateOne = async (id: number) => {
        const section = sections.find(s => s.id === id);
        if (!section) return;
        const skillData = section.skills.map(sk => ({ name: sk.skill.name, level: sk.level }));
        try {
            const response = await generateFeedbackForSection(section.name, section.keywords, skillData);
            setSections(prev => prev.map(s => (s.id === id ? { ...s, generatedText: response } : s)));
        } catch (error) {
            console.error('Ошибка генерации:', error);
            alert('Не удалось сгенерировать фидбек');
        }
    };

    const handleSaveFinalFeedback = async () => {
        setSaving(true);
        const items = sections.flatMap(section =>
            section.skills.map(skillData => ({
                section_id: section.id,
                skill_id: skillData.skill.id,
                level: skillData.level,
                comment: section.generatedText || '',
            }))
        );

        if (items.length === 0) {
            alert('Нельзя сохранить фидбек без навыков.');
            setSaving(false);
            return;
        }

        const payload = {
            candidate_id: candidateIdNum,
            interviewer_id: 1,
            final_feedback: finalFeedback,
            items,
        };

        console.log('📤 Отправка payload:', JSON.stringify(payload, null, 2));

        try {
            await saveFinalFeedback(payload);
            alert('Фидбек сохранён');
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            alert('Ошибка при сохранении');
        } finally {
            setSaving(false);
        }
    };

    const handleAddSection = () => {
        if (newSectionId === '') return;
        const sectionToAdd = availableSections.find(s => s.id === newSectionId);
        if (!sectionToAdd || sections.some(s => s.id === newSectionId)) return;

        const defaultSkills = allSkills.slice(0, 2).map(skill => ({ skill, level: 3 }));

        setSections(prev => [...prev, {
            ...sectionToAdd,
            keywords: '',
            generatedText: '',
            skills: defaultSkills,
        }]);
        setNewSectionId('');
    };

    const handleDeleteSection = (id: number) => {
        setSections(prev => prev.filter(s => s.id !== id));
    };

    if (loading) {
        return (
            <Box p={3} textAlign="center">
                <CircularProgress />
                <Typography mt={1}>Загрузка данных...</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            {candidate && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f0f4ff' }}>
                    <Typography variant="h6">Информация о кандидате</Typography>
                    <Typography><strong>ФИО:</strong> {candidate.fullname}</Typography>
                    <Typography><strong>Должность:</strong> {candidate.position}</Typography>
                    <Typography><strong>Email:</strong> {candidate.email}</Typography>
                </Paper>
            )}

            <Box display="flex" gap={4} alignItems="flex-start">
                {/* Левая часть */}
                <Box flex={1}>
                    <Box display="flex" gap={2} mb={3}>
                        <FormControl fullWidth>
                            <InputLabel>Выберите раздел</InputLabel>
                            <Select
                                value={newSectionId}
                                label="Выберите раздел"
                                onChange={e => setNewSectionId(Number(e.target.value))}
                            >
                                {availableSections.map(({ id, name }) => (
                                    <MenuItem
                                        key={id}
                                        value={id}
                                        disabled={sections.some(s => s.id === id)}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddSection}
                            disabled={newSectionId === ''}
                        >
                            Добавить
                        </Button>
                    </Box>

                    {sections.map(section => (
                        <Paper key={section.id} sx={{ p: 2, mb: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">{section.name}</Typography>
                                <IconButton onClick={() => handleDeleteSection(section.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>

                            <TextField
                                fullWidth
                                multiline
                                label="Ключевые слова"
                                value={section.keywords}
                                onChange={e =>
                                    setSections(prev => prev.map(s =>
                                        s.id === section.id ? { ...s, keywords: e.target.value } : s
                                    ))}
                                sx={{ my: 1 }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<SmartToyIcon />}
                                onClick={() => handleGenerateOne(section.id)}
                            >
                                Сгенерировать
                            </Button>

                            <Box mt={2}>
                                <Typography fontWeight="medium">Навыки:</Typography>
                                {section.skills.map(({ skill, level }) => (
                                    <Box key={skill.id} display="flex" alignItems="center" gap={1} mb={1}>
                                        <Typography>{skill.name}</Typography>
                                        <Rating
                                            value={level}
                                            onChange={(_, newValue) => {
                                                setSections(prev => prev.map(s =>
                                                    s.id === section.id ? {
                                                        ...s,
                                                        skills: s.skills.map(sk =>
                                                            sk.skill.id === skill.id ? { ...sk, level: newValue || 1 } : sk
                                                        )
                                                    } : s
                                                ));
                                            }}
                                        />
                                        <IconButton size="small" onClick={() => {
                                            setSections(prev => prev.map(s =>
                                                s.id === section.id ? {
                                                    ...s,
                                                    skills: s.skills.filter(sk => sk.skill.id !== skill.id)
                                                } : s
                                            ));
                                        }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}

                                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                    <InputLabel>Добавить навык</InputLabel>
                                    <Select
                                        value=""
                                        onChange={e => {
                                            const skillId = Number(e.target.value);
                                            const skill = allSkills.find(sk => sk.id === skillId);
                                            if (!skill || section.skills.some(sk => sk.skill.id === skillId)) return;
                                            setSections(prev => prev.map(s =>
                                                s.id === section.id
                                                    ? { ...s, skills: [...s.skills, { skill, level: 3 }] }
                                                    : s
                                            ));
                                        }}
                                    >
                                        {allSkills.map(skill => (
                                            <MenuItem key={skill.id} value={skill.id}>
                                                {skill.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {section.generatedText && (
                                <Box mt={2}>
                                    <Typography fontWeight="medium">Комментарий:</Typography>
                                    <Paper sx={{ p: 1, mt: 1, backgroundColor: '#f9f9f9' }}>
                                        <Typography whiteSpace="pre-line">{section.generatedText}</Typography>
                                    </Paper>
                                </Box>
                            )}
                        </Paper>
                    ))}
                </Box>

                {/* Правая часть */}
                <Box flex={1} maxHeight="80vh" overflow="auto">
                    <Paper sx={{ p: 3, backgroundColor: '#f0f0f0' }}>
                        <Typography variant="h6" gutterBottom>Итоговый фидбек (предпросмотр):</Typography>
                        {finalFeedback
                            ? <Typography whiteSpace="pre-line">{finalFeedback}</Typography>
                            : <Typography color="text.secondary">Комментарий пока не сгенерирован</Typography>}
                    </Paper>
                    <Box mt={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveFinalFeedback}
                            disabled={saving}
                        >
                            {saving ? 'Сохраняем...' : 'Сохранить финальный фидбек'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default FeedbackGenerator;

