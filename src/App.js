import React, { useState, useEffect } from 'react';
import styles from './App.module.css';

const App = () => {

  const loadNews = () => {
    const data = localStorage.getItem('news');
    return data ? JSON.parse(data) : [];
  };

  const [news, setNews] = useState(loadNews);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);

  const handleSave = () => {
    if (title.trim() === '' || content.trim() === '') return;

    if (isEditing) {
      setNews(
          news.map((item) =>
              item.id === currentId ? { ...item, title, content } : item
          )
      );
      setIsEditing(false);
      setCurrentId(null);
    } else {
      const newNews = {
        id: Date.now(),
        title,
        content,
      };
      setNews([newNews, ...news]);
    }

    setTitle('');
    setContent('');
  };

  const handleEdit = (id) => {
    const newsItem = news.find((item) => item.id === id);
    if (newsItem) {
      setTitle(newsItem.title);
      setContent(newsItem.content);
      setIsEditing(true);
      setCurrentId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить новость?')) {
      setNews(news.filter((item) => item.id !== id));
    }
  };

  return (
      <div className={styles.container}>
        <h1 className={styles.header}>Новости</h1>

        <div className={styles.form}>
          <input
              className={styles.input}
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              className={styles.textarea}
              placeholder="Содержание"
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />
          <button className={styles.button} onClick={handleSave}>
            {isEditing ? 'Обновить' : 'Добавить'}
          </button>
          {isEditing && (
              <button
                  className={`${styles.button} ${styles.cancelButton}`}
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentId(null);
                    setTitle('');
                    setContent('');
                  }}
              >
                Отмена
              </button>
          )}
        </div>

        <div className={styles.listContainer}>
          {news.length ===0 ? (
              <p style={{ textAlign:'center' }}>Нет новостей</p>
          ) : (
              news.map((item) => (
                  <div key={item.id} className={styles.card}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardContent}>{item.content}</p>
                    <div className={styles.buttonsContainer}>
                      <button className={`${styles.smallButton} ${styles.editButton}`} onClick={() => handleEdit(item.id)}>
                        Редактировать
                      </button>
                      <button
                          className={`${styles.smallButton} ${styles.deleteButton}`}
                          onClick={() => handleDelete(item.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
};

export default App;
