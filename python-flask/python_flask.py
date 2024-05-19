from flask import Flask
from downloader import download_playlist

app = Flask(__name__)

with app.app_context():
    download_playlist('Piano')


@app.route('/')
def root():
    return "Download process started. Check the console for progress."

if __name__ == '__main__':
    app.run()
