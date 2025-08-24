import React, { useState, useEffect } from "react";
import { Button, Spinner, Container, Row, Col, Modal, Dropdown, Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import ChatBox from "./ChatBox";
import { FaBookmark, FaRegBookmark, FaUserCircle, FaStickyNote, FaSignOutAlt } from "react-icons/fa";
import "./NewsCarousel.css";
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ article, onOpenChat, onSaveArticle, isSaved }) => {
  return (
    <div className="news-item-card">
      <div className="news-image-container">
        {article.urlToImage && (
          <img 
            src={article.urlToImage} 
            alt={article.title} 
            className="news-thumbnail"
          />
        )}
        <div className="news-source">{article.source.name || "Unknown Source"}</div>
      </div>
      
      <div className="news-content">
        <h3 className="news-title">{article.title}</h3>
        <p className="news-description">{article.description}</p>
        
        <div className="news-actions">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="read-more-btn"
          >
            Read Full Article
          </a>
          <Button 
            onClick={() => onOpenChat(article)} 
            className="chat-btn"
          >
            Ask About This
          </Button>
          <Button 
            onClick={() => onSaveArticle(article)}
            className="save-btn"
            variant={isSaved ? "success" : "outline-success"}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(Cookies.get("searchQuery") || "");
  const [showChat, setShowChat] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedArticles, setSavedArticles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showSavedArticles, setShowSavedArticles] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [currentNote, setCurrentNote] = useState({ title: "", content: "", articleId: null });
  const [showProfile, setShowProfile] = useState(false);
  
  const articlesPerPage = 6;
  const apiKey = "4ddd0b16601a47cab49e48e854ae111e";

  useEffect(() => {
    const savedArticlesData = localStorage.getItem('savedArticles');
    const notesData = localStorage.getItem('userNotes');
    
    if (savedArticlesData) {
      setSavedArticles(JSON.parse(savedArticlesData));
    }
    
    if (notesData) {
      setNotes(JSON.parse(notesData));
    }
    
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${searchQuery || "trending"}&apiKey=${apiKey}`
      );
      const filteredArticles = response.data.articles.filter(
        (article) =>
          article.urlToImage && article.url && article.title && article.description
      );
      setArticles(filteredArticles.slice(0, 100));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    Cookies.set("searchQuery", searchQuery, { expires: 1 });
    fetchArticles();
  };

  const handleOpenChat = (article) => {
    setSelectedArticle(article);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };
  
  const handleSaveArticle = (article) => {
    const isAlreadySaved = savedArticles.some(saved => saved.url === article.url);
    let updatedSavedArticles;
    
    if (isAlreadySaved) {
      updatedSavedArticles = savedArticles.filter(saved => saved.url !== article.url);
    } else {
      updatedSavedArticles = [...savedArticles, article];
    }
    
    setSavedArticles(updatedSavedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(updatedSavedArticles));
  };
  
  const handleSaveChat = (chatText) => {
    const newNote = {
      id: Date.now(),
      title: `Note about: ${selectedArticle.title.substring(0, 30)}...`,
      content: chatText,
      articleId: selectedArticle.url,
      timestamp: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
  };
  
  const handleAddNote = () => {
    setCurrentNote({ title: "", content: "", articleId: selectedArticle ? selectedArticle.url : null });
    setShowAddNote(true);
  };
  
  const handleSaveNote = () => {
    if (currentNote.title.trim() === "" || currentNote.content.trim() === "") {
      return;
    }
    
    const newNote = {
      id: Date.now(),
      title: currentNote.title,
      content: currentNote.content,
      articleId: currentNote.articleId,
      timestamp: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
    setShowAddNote(false);
  };
  
  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
  };
  
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    navigate('/'); 
  };

  // Fix: Added this function to properly reset all profile-related states
  const handleBackToNews = () => {
    setShowProfile(false);
    setShowSavedArticles(false);
    setShowNotes(false);
  };

  // Calculate the articles to display on the current page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = showSavedArticles 
    ? savedArticles.slice(indexOfFirstArticle, indexOfLastArticle)
    : articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil((showSavedArticles ? savedArticles.length : articles.length) / articlesPerPage);

  const isArticleSaved = (article) => {
    return savedArticles.some(saved => saved.url === article.url);
  };

  return (
    <Container className="news-page-container">
      <div className="header-section d-flex justify-content-between align-items-center">
        <div className="search-section flex-grow-1 me-3">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Button type="submit" className="search-button">
              Search
            </Button>
          </form>
        </div>
        
        <div className="profile-section">
          <Dropdown>
            <Dropdown.Toggle 
              variant="outline-primary" 
              id="profile-dropdown"
              className="profile-dropdown-btn"
            >
              <FaUserCircle size={20} className="me-1" /> Profile
            </Dropdown.Toggle>
            
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {
                setShowSavedArticles(true);
                setShowNotes(false);
                setShowProfile(true);
              }}>
                <FaBookmark className="me-2" /> Saved Articles
              </Dropdown.Item>
              <Dropdown.Item onClick={() => {
                setShowNotes(true);
                setShowSavedArticles(false);
                setShowProfile(true);
              }}>
                <FaStickyNote className="me-2" /> My Notes
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      
      {showProfile && (
        <div className="profile-container mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>{showSavedArticles ? "Saved Articles" : "My Notes"}</h3>
            <Button onClick={handleBackToNews} className="beige-button">
              Back to News
            </Button>
          </div>
          
          {showSavedArticles && (
            savedArticles.length > 0 ? (
              <Row className="news-grid">
                {currentArticles.map((article, index) => (
                  <Col key={index} lg={6} xl={4} className="mb-4">
                    <NewsCard 
                      article={article} 
                      onOpenChat={handleOpenChat}
                      onSaveArticle={handleSaveArticle}
                      isSaved={true}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="empty-state">
                <h5>No saved articles yet</h5>
                <p>Articles you save will appear here</p>
              </div>
            )
          )}
          
          {showNotes && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <Button onClick={handleAddNote} className="beige-button">Add New Note</Button>
              </div>
              {notes.length > 0 ? (
                <div className="notes-list">
                  {notes.map(note => (
                    <div key={note.id} className="note-card">
                      <div className="note-header">
                        <h5>{note.title}</h5>
                        <small>
                          {new Date(note.timestamp).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="note-content">{note.content}</p>
                      <div className="note-actions">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="note-delete-btn"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h5>No notes yet</h5>
                  <p>Notes you create will appear here</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!showProfile && (
        loading ? (
          <div className="loading-container">
            <Spinner animation="border" className="loading-spinner" />
            <h4>Loading articles...</h4>
          </div>
        ) : articles.length > 0 ? (
          <>
            <Row className="news-grid">
              {currentArticles.map((article, index) => (
                <Col key={index} lg={6} xl={4} className="mb-4">
                  <NewsCard 
                    article={article} 
                    onOpenChat={handleOpenChat}
                    onSaveArticle={handleSaveArticle}
                    isSaved={isArticleSaved(article)}
                  />
                </Col>
              ))}
            </Row>
            
            <div className="pagination-controls">
              <Button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-nav-btn beige-button"
              >
                Previous
              </Button>
              
              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-nav-btn beige-button"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="no-results">
            <h4>No articles found. Try a different topic.</h4>
          </div>
        )
      )}

      {/* Chat Modal */}
      <Modal 
        show={showChat} 
        onHide={handleCloseChat} 
        size="lg"
        centered
        className="chat-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Ask about: {selectedArticle?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedArticle && (
            <div className="chat-container">
              <ChatBox 
                articleId={selectedArticle.url} 
                onSaveChat={handleSaveChat}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddNote} className="beige-button">
            <FaStickyNote className="me-1" /> Add Note
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Add Note Modal */}
      <Modal
        show={showAddNote}
        onHide={() => setShowAddNote(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Note title"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write your note here..."
                value={currentNote.content}
                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddNote(false)}>
            Cancel
          </Button>
          <Button className="beige-button" onClick={handleSaveNote}>
            Save Note
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewsList;