import React, { useState } from 'react';
import Modal from 'react-modal';

const NewsCard = ({ title, summary, link }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div className="news-card" onClick={openModal}>
            <h2>{title}</h2>
            <p>{summary}</p>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>{title}</h2>
                <p>{summary}</p>
                <a href={link} target="_blank" rel="noopener noreferrer">Read more</a>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default NewsCard;