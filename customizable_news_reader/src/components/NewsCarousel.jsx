import React, { useState, useEffect } from "react";
import { Carousel, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import ChatBox from "./ChatBox";

const NewsCard = ({ article }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: "300px",
        margin: "0 15px",
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }}>
        <Card.Header
          style={{
            fontSize: "0.9rem",
            backgroundColor: "#f8f9fa",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {article.source.name || "Unknown Source"}
        </Card.Header>

        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Card.Img
              variant="top"
              src={article.urlToImage}
              alt={article.title}
              style={{
                height: "150px",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          </a>
        )}

        <Card.Body style={{ textAlign: "center" }}>
          <Card.Title style={{ fontSize: "1rem", marginBottom: "10px" }}>
            {article.title}
          </Card.Title>
          {expanded && (
            <>
              <Card.Text style={{ fontSize: "0.9rem" }}>
                {article.description}
              </Card.Text>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                {/* ChatBox to handle user queries */}
                <ChatBox articleId={article.url} />
              </div>
            </>
          )}
        </Card.Body>

        <Card.Footer
          style={{
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "#e9ecef",
          }}
          onClick={toggleExpand}
        >
          {expanded ? "▲ Collapse" : "▼ Expand"}
        </Card.Footer>
      </Card>
    </div>
  );
};

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(Cookies.get("searchQuery") || "");
  const apiKey = "4ddd0b16601a47cab49e48e854ae111e";

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

  useEffect(() => {
    fetchArticles();
  }, [searchQuery]);

  return (
    <div>
      <center style={{ marginBottom: "20px" }}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control rounded-0"
            style={{ width: "300px", marginBottom: "10px" }}
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>
      </center>

      <div
        style={{
          backgroundColor: "#343a40",
          padding: "20px 0",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <Carousel indicators={false} interval={null}>
          {articles.length > 0 ? (
            Array.from({ length: Math.ceil(articles.length / 3) }).map((_, slideIndex) => (
              <Carousel.Item key={slideIndex}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    padding: "10px",
                  }}
                >
                  {articles
                    .slice(slideIndex * 3, slideIndex * 3 + 3)
                    .map((article, index) => (
                      <NewsCard key={index} article={article} />
                    ))}
                </div>
              </Carousel.Item>
            ))
          ) : loading ? (
            <h4 style={{ color: "white", textAlign: "center" }}>
              <Spinner animation="border" variant="light" />
              Loading articles...
            </h4>
          ) : (
            <h4 style={{ color: "white", textAlign: "center" }}>
              No articles found. Try a different topic.
            </h4>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default NewsList;
