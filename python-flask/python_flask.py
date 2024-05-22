import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from downloader import download_playlist, download_single_video

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

# with app.app_context():
#     download_playlist('Piano')


@app.route('/')
def root():
    return "Flask Service Running"
    # return "Download process started. Check the console for progress."

@app.post('/youtube')
def postYoutube():
    print("Hello")
    success = {"status": False, "title": "no video"}
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"success": False, "message": "Missing URL in request body"}), 400
    if (request.args.get('playlist') == 'false'):
        success = download_single_video(data["url"])
    else:
        success = download_playlist(data["url"])
    return jsonify({"success": success["status"], "title": success["title"]}), 200 if success["status"] else 500

@app.route('/youtube', methods=['GET'])
def getVideo(): 
    data = request.args.get('title') 
    try: 
        # send_from_directory if this doesn't work
        # C:\Users\User\OneDrive\Documents\Gogo Stuff\Coding Projects\Grid-Thing\python-flask\Videos
        # C:\Users\oscar\Documents\Entertainment\Coding Ideas\Grid-Thing\python-flask\Videos
        # "C:/Users/oscar/Documents/Entertainment/Coding Ideas/Grid-Thing/python-flask/Videos/"
        root_dir = os.path.dirname(os.path.abspath(__file__))
        # Construct the full path to the video file
        video_path = os.path.join(root_dir, 'Videos', data)
        print(video_path)
        return send_file(video_path, as_attachment=True, download_name=data)
    except Exception as e: 
        return str(e)

if __name__ == '__main__':
    app.run(port=3001)
