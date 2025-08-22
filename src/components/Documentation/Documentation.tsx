import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import ArticleIcon from "@mui/icons-material/Article";
import SchoolIcon from "@mui/icons-material/School";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export const Documentation = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 128px)", // Вычитаем высоту header и footer
                maxWidth: 800,
                mx: "auto",
                px: 3,
                py: 4,
                [theme.breakpoints.down("sm")]: {
                    px: 2,
                },
            }}
        >
            <Typography
                sx={{
                    textAlign: "center",
                    mb: 4,
                    fontWeight: 500,
                    color: "primary.main",
                }}
                variant="h5"
            >
                Список доступных документов:
            </Typography>
            <List
                sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 1,
                    p: 0,
                    "& .MuiListItem-root": {
                        px: 3,
                        py: 1.5,
                        "&:not(:last-child)": {
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        },
                        "&:hover": {
                            bgcolor: "action.hover",
                        },
                    },
                }}
            >
                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://www.bsuir.by/ru/smk"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Трудовой кодекс
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://www.bsuir.by/ru/stranitsa-yurista"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Техническая поддержка
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://iis.bsuir.by/public_iis_files/studentMail.pdf"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Устав компании
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://www.bsuir.by/ru/energosberezhenie"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Порядок принятия на работу
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://www.bsuir.by/m/12_100229_1_166894.pdf"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Политика PanCompany в области интеллектуальной собственности
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://www.bsuir.by/m/12_100229_1_157457.pdf"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Политика безопасности в отношении обработки персональных данных
                            PanCompany
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://www.bsuir.by/ru/sayty-partnyory"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Сайты партнёры
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://iis.bsuir.by/public_iis_files/softwareList.pdf"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Стандартный набор ПО
                        </Link>
                    </ListItemText>
                </ListItem>

                <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>
                        <Link
                            href="https://www.bsuir.by/ru/umu-informatsionnaya-baza"
                            variant="body1"
                            target="_blank"
                            sx={{
                                fontWeight: 500,
                                "&:hover": { color: "primary.dark" },
                            }}
                        >
                            Нормативно-правовое обеспечение трудового процесса
                        </Link>
                    </ListItemText>
                </ListItem>
            </List>
        </Box>
    );
};