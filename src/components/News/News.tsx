import React, { useEffect, useState } from 'react';
import './News.css';
import { Article } from '../../types/Article';
import { fetchArticles } from '../../api/habr';
import { Loading } from '../Loading/Loading'; // ✅ импорт компонента загрузки

const News: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        fetchArticles()
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch(() => {
                console.error("Ошибка при загрузке статей");
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) return <Loading open={true} />; // ✅ используем компонент загрузки
    if (error) return <p>⚠️ Не удалось загрузить статьи с Habr.</p>;

    return (
        <div className="page-wrapper">
            <header className="news-header">
                <h1>📰 Новости с Habr</h1>
            </header>
            <div className="news-container">
                {articles.map((article, index) => (
                    <div
                        key={index}
                        className="news-card"
                        style={{ '--i': index } as React.CSSProperties}
                    >
                        <img
                            src={article.imageUrl || "/static/images/news-header.jpg"}
                            alt="preview"
                            className="news-image"
                        />
                        <div className="news-content">
                            <a href={article.link} target="_blank" rel="noopener noreferrer">
                                <h3 className="news-title">{article.title}</h3>
                            </a>
                            <p className="news-date">{article.pubDate}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
