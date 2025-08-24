import os
from pathlib import Path
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
    def __init__(self):
        self.temp_folder = Path("./temp")
        self.temp_folder.mkdir(exist_ok=True)  

        self.document_store = InMemoryDocumentStore()
        self.processed_articles = set()  

        self.template = """
            Refer to the following news articles and answer the questions below briefly:\n
            {% for news_article in documents %}\n
                Article: {{ news_article.content }}\n
            {% endfor %}\n
            Chat History: {{ chat_history }}\n
            Question: {{ question }}\n
            Answer:
        """

    def fetch_article(self, url):
        """
        Fetches the HTML content of the article from the provided URL.
        """
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"Error fetching article from {url}: {e}")
            raise

    def save_article_to_temp(self, article_id, article_content):
        """
        Saves the fetched article content as an HTML file in the temp folder.
        """
        file_path = self.temp_folder / f"{article_id}.html"
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(article_content)
        return file_path

    def is_article_processed(self, article_file):
        """
        Checks if an article has already been processed to avoid duplicate processing.
        """
        article_id = Path(article_file).stem
        return article_id in self.processed_articles

    def create_doc_pipeline(self):
        """
        Creates a new document processing pipeline.
        """
        self.doc_pipeline = Pipeline()
        self.doc_pipeline.add_component("converter", HTMLToDocument())
        self.doc_pipeline.add_component("cleaner", DocumentCleaner())
        self.doc_pipeline.add_component("writer", DocumentWriter(document_store=self.document_store))
        self.doc_pipeline.connect("converter", "cleaner")
        self.doc_pipeline.connect("cleaner", "writer")

    def process_article(self, article_file):
        """
        Processes and stores the article in the document store.
        """
        article_id = Path(article_file).stem

        
        if article_id in self.processed_articles:
            print(f"Skipping already processed article: {article_id}")
            return

        
        existing_docs = self.document_store.filter_documents(filters={})
        matching_docs = [doc for doc in existing_docs if doc.meta.get("article_id") == article_id]

        if matching_docs:
            print(f"Deleting existing document with article_id: {article_id}")
            self.document_store.delete_documents(ids=[doc.id for doc in matching_docs])

        
        self.create_doc_pipeline()
        self.doc_pipeline.run({
            "converter": {"sources": [article_file]}
        })

        
        self.processed_articles.add(article_id)
        print(f"Processed and stored article: {article_id}")

    def create_rag_pipeline(self):
        """
        Creates a new RAG pipeline instance for each query.
        """
        self.rag_pipeline = Pipeline()
        self.rag_pipeline.add_component("retriever", InMemoryBM25Retriever(document_store=self.document_store))
        self.rag_pipeline.add_component("builder", PromptBuilder(template=self.template))

       
        llm_instance = OllamaGenerator(model="llama3.2", url="http://localhost:11434")  
        self.rag_pipeline.add_component("llm", llm_instance)

        self.rag_pipeline.connect("retriever.documents", "builder.documents")
        self.rag_pipeline.connect("builder", "llm")

    def chat(self, chat_history, question):
        """
        Handles chat queries using the RAG pipeline.
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


