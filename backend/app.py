from flask import Flask, jsonify, request
from flask_cors import CORS
from news_agent import NewsAgent  # Import the NewsAgent class

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Instantiate the NewsAgent from the news_agent.py
newsAgent = NewsAgent()

# API to handle user chat queries on a particular article
@app.route('/')
def home():
    return 'Welcome to flask API'
@app.route('/chat', methods=['GET'])
def chat():
    message = request.args.get('message')  # Get the user's query
    article_url = request.args.get('articleUrl')  # Get the article URL

    # Check if both parameters are provided
    if not message:
        return jsonify({"error": "Message parameter is required"}), 400
    if not article_url:
        return jsonify({"error": "Article URL is required"}), 400

    try:
        # Fetch and process the article
        article_content = newsAgent.fetch_article(article_url)
        article_file = newsAgent.save_article_to_temp(article_url.split("/")[-1], article_content)
        newsAgent.process_article(article_file)

        # Process query on the article using the chat method of NewsAgent
        response = newsAgent.chat([], message)
        return jsonify({"response": response}), 200  # Return the response as JSON
    
    except Exception as e:
        # Log the error to the console for better debugging
        print(f"Error in chat API: {str(e)}")  # Add logging here for debugging
        return jsonify({"error": "Internal Server Error. Check server logs."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
