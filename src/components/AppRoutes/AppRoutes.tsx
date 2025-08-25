import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Preview from "../Preview/Preview";
import AboutPage from "../AboutPage/AboutPage";
import {Documentation} from "../Documentation/Documentation";
import News from "../News/News";
import Registration from "../Registration/Registration";
import SectionPage from "../SectionPage/SectionPage";

import CandidatePage from "../CandidatePage/CandidatePage";
import SkillPage from "../SkillPage/SkillPage";
import FeedbackGenerator from "../FeedbackGenerator/FeedbackGenerator";

export const AppRoutes = () => {
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case '/':
                document.title = 'Главная - PanCompany';
                setFavicon('home.ico');
                break;
            case '/auth':
                document.title = 'Вход - PanCompany';
                setFavicon('login.ico');
                break;
            case '/about':
                document.title = 'О нас - PanCompany';
                setFavicon('about.ico');
                break;
            case '/documentation':
                document.title = 'Документация - PanCompany';
                setFavicon('favicon-docs.ico');
                break;
            case '/employees':
                document.title = 'Учет работников - PanCompany';
                setFavicon('employee.ico');
                break;
            case '/news':
                document.title = 'Новости - PanCompany';
                setFavicon('news.ico');
                break;
            default:
                document.title = 'Unknowing - PanCompany';
                setFavicon('favicon-default.ico');
                break;
        }
    }, [location]);

    const setFavicon = (favicon: string) => {
        const link: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
        if (link) {
            link.href = `/static/icons/${favicon}`;
        }
    };

    return (
        <Routes>
            <Route path="/" element={<Preview />} />
            <Route path="/auth" element={<Registration />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/skills" element={<SkillPage />} />
            <Route path="/sections" element={<SectionPage />} />
            <Route path="/news" element={<News />} />
            <Route path="/candidates" element={<CandidatePage />} />
            <Route path="/feedback/:candidateId" element={<FeedbackGenerator />} />
        </Routes>
    );
};
