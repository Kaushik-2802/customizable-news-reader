import os
from pathlib import Path
import json
import requests
from haystack.components.converters import HTMLToDocument
from haystack.components.preprocessors import DocumentCleaner
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.writers import DocumentWriter
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.builders import PromptBuilder
from haystack_integrations.components.generators.ollama import OllamaGenerator
from haystack import Pipeline


class NewsAgent:
    def __init__(self, document_store=None):
        self.temp_folder = Path("./temp")
        self.temp_folder.mkdir(exist_ok=True)  # Ensure temp folder exists
        
        if document_store is None:
            self.document_store = InMemoryDocumentStore()
        else:
            self.document_store = document_store
        
        self.template = """
            Refer to the following news articles and answer the questions below:\n
            {% for news_article in documents %}\n
                Article: {{ news_article.content }}\n
            {% endfor %}\n
            Chat History: {{ chat_history }}\n
            Question: {{ question }}\n
            Answer:
        """
        
        self.llm = OllamaGenerator(model="llama3.2", url="http://localhost:11434")
    
    def fetch_article(self, url):
        """
        Fetches the HTML content of the article from the provided URL.
        """
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return response.text
            else:
                raise Exception(f"Failed to fetch article: {url}, Status Code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error fetching article from {url}: {e}")
            raise
    
    def save_article_to_temp(self, article_id, article_content):
        """
        Saves the fetched article content as an HTML file in the temp folder.
        """
        file_path = self.temp_folder / f"{article_id}.html"
        try:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(article_content)
            return file_path
        except IOError as e:
            print(f"Error saving article {article_id}: {e}")
            raise
    
    def create_doc_pipeline(self):
        self.doc_pipeline = Pipeline()
        self.doc_pipeline.add_component("converter", HTMLToDocument())
        self.doc_pipeline.add_component("cleaner", DocumentCleaner())
        self.doc_pipeline.add_component("writer", DocumentWriter(document_store=self.document_store))
        self.doc_pipeline.connect("converter", "cleaner")
        self.doc_pipeline.connect("cleaner", "writer")
    
    def process_article(self, article_file):
        """
        Processes the saved article and stores it in the document store.
        """
        try:
            self.create_doc_pipeline()
            self.doc_pipeline.run({"converter": {"sources": [article_file]}})
        except Exception as e:
            print(f"Error processing article {article_file}: {e}")
            raise
    
    def create_rag_pipeline(self):
        self.rag_pipeline = Pipeline()
        self.rag_pipeline.add_component("retriever", InMemoryBM25Retriever(document_store=self.document_store))
        self.rag_pipeline.add_component("builder", PromptBuilder(template=self.template))
        self.rag_pipeline.add_component("llm", self.llm)
        self.rag_pipeline.connect("retriever.documents", "builder.documents")
        self.rag_pipeline.connect("builder", "llm")
    
    def chat(self, chat_history, question):
        """
        Handles chat queries and answers the questions.
        """
        try:
            self.create_rag_pipeline()
            response = self.rag_pipeline.run({
                "retriever": {"query": question},
                "builder": {"question": question, "chat_history": str(chat_history)}
            })
            return response['llm']['replies'][0]
        except Exception as e:
            print(f"Error processing chat query: {e}")
            raise


if __name__ == "__main__":
    newsAgent = NewsAgent()
    
    headlines = [
        {"id": 1, "title": "New AI Model Released", "url": "https://example.com/article1"},
        {"id": 2, "title": "Economic Growth Report", "url": "https://example.com/article2"},
    ]
    
    chat_history = []
    
    while True:
        print("\nAvailable Headlines:")
        for headline in headlines:
            print(f"[{headline['id']}] {headline['title']}")
        article_id = input("\nEnter the ID of the article you want to ask about (or type 'exit' to quit): ")
        if article_id.lower() == "exit":
            break
        try:
            selected_article = next(h for h in headlines if h["id"] == int(article_id))
            article_content = newsAgent.fetch_article(selected_article["url"])
            article_file = newsAgent.save_article_to_temp(article_id, article_content)
            newsAgent.process_article(article_file)
        except Exception as e:
            print(f"Error: {e}")
            continue
        
        question = input("Ask a question about the article: ")
        if question.lower() == "exit":
            break
        
        answer = newsAgent.chat(chat_history, question)
        print("Answer: ", answer)
        chat_history.append({"question": question, "answer": answer})
