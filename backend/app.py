from flask import Flask, jsonify, request
from flask_cors import CORS
from news_agent import NewsAgent
import traceback

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Instantiate NewsAgent
newsAgent = NewsAgent()

@app.route('/')
def home():
    return 'Welcome to Flask API'

@app.route('/chat', methods=['GET'])
def chat():
    message = request.args.get('message')  # User's query
    article_url = request.args.get('articleUrl')  # Article URL

    # Validate parameters
    if not message:
        return jsonify({"error": "Message parameter is required"}), 400
    if not article_url:
        return jsonify({"error": "Article URL is required"}), 400

    try:
        # Fetch and process the article
        article_content = newsAgent.fetch_article(article_url)

        # Generate a unique filename based on URL
        article_filename = article_url.split("/")[-1] + ".html"
        article_file = newsAgent.save_article_to_temp(article_filename, article_content)

        # Process article only if it's new
        if not newsAgent.is_article_processed(article_file):
            newsAgent.process_article(article_file)

        # Process query on the article
        response = newsAgent.chat([], message)

        return jsonify({"response": response}), 200

    except Exception as e:
        print("Error in chat API:", str(e))
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error. Check server logs."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

