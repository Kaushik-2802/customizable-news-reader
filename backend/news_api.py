import requests
import json

class NewsAPI:
    def __init__(self, country=None, category=None, sources=None, q=None):
        self.env = json.load(open("env.json", "r"))
        self.country = country
        self.category = category
        self.sources = sources
        self.q = q
        self.api_key = self.env["api-key"]
        self.endpoint = self.env["general-endpoint"]

    def get_news(self):
        url = self.endpoint+"?"
        if self.country:
            url += f"country={self.country}&"
        if self.category:
            url += f"category={self.category}&"
        if self.sources:
            url += f"sources={self.sources}&"
        if self.q:
            url += f"q={self.q}&"
        url += f"apiKey={self.api_key}"
        response = requests.get(url)
        print("news api response:",response.json())
        return response.json()

    def get_headlines(self):
        news = dict(self.get_news())
        print(news.keys())
        headlines = []
        for article in news["articles"]:
            headlines.append({"title": article["title"], "description": article["description"], "url": article["url"], "image": article["urlToImage"]})
        return headlines[:20]

if __name__ == "__main__":
    news = NewsAPI(country="us", category=None, q=None)
    headlines = news.get_headlines()
    for headline in headlines:
        print(headline["title"])
        print(headline["description"])
        print(headline["url"])
        print(headline["image"])
        print(headline["content"])
        print("\n\n")
    
