import os
import glob
import boto3
import botocore
import botocore.exceptions
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_mysqldb import MySQL
from pymongo import MongoClient
from dotenv import load_dotenv
import pymongo.errors
from downloader import download_playlist, download_single_video

app = Flask(__name__)

CORS(app)
load_dotenv()

def s3_connect():
    try: 
        s3_client = boto3.client(
            service_name='s3',
            region_name=os.getenv('AWS_REGION'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('AWS_SECRET_KEY')
        )
        print("Successfully connected to s3")
        return s3_client
    except Exception as error: 
        print("Couldn't connect to s3")
        print(f"Error Details: {error.args}")    
        return None

def mongo_connect():
    try: 
        mongo_client = MongoClient(f"mongodb+srv://{os.getenv('MONGODB_USER')}:{os.getenv('MONGODB_PASSWORD')}@whatisacluster.n8fqxho.mongodb.net/{os.getenv('MONGODB_DBNAME')}?retryWrites=true&w=majority&appName=WhatIsACluster")
        print("Successfully connected MongoDB")
        return mongo_client
    except pymongo.errors.ConnectionFailure as error: 
        print("Couldn't connect to mongodb")
        print(f"Error Details: {error.args}")    
        return None

s3_client = s3_connect()
mongo_client = mongo_connect()

def s3_upload(FILE_NAME):
    LOCAL_FILE = './Videos/' + FILE_NAME
    NAME_FOR_S3 = 'videos/' + FILE_NAME

    if (s3_client):
        try: 
            s3_client.upload_file(LOCAL_FILE, os.getenv('AWS_S3_BUCKET_NAME'), NAME_FOR_S3)
            print("Successfully uploaded file")
            mongo_upload(FILE_NAME, NAME_FOR_S3)
        except botocore.exceptions.ClientError as error: 
            print("Couldn't upload video to S3")
            print(f"Error Details: {error.args}")
    else: 
        print("s3 not connected")

def mongo_upload(video_title, video_path): 
    if (mongo_client):
        database = mongo_client[os.getenv('MONGODB_DBNAME')]
        collection = database['videos']
        video = { "title": video_title, 
                "video_path": video_path
        }
        try: 
            collection.insert_one(video)
            print("Successfully uploaded video path")
        except Exception as error: 
            print("Couldn't add video path to MongoDB")
            print(f"Error Details: {error.args}")
    else: 
        print("MongoDB not connected")  

# with app.app_context():
#     # download_playlist('Piano')


@app.route('/')
def root():
    return "Flask Service Running"
    # return "Download process started. Check the console for progress."

@app.post('/youtube')
def postYoutube():
    print("Hello")
    success = {"status": False, "title": "no video"}
    data = request.get_json()
    print(data)
    if not data or 'url' not in data:
        return jsonify({"success": False, "message": "Missing URL in request body"}), 400
    if (request.args.get('playlist') == 'false'):
        success = download_single_video(data["url"])
        s3_upload(success["title"][0])
    else:
        success = download_playlist(data["url"])
    return jsonify({"success": success["status"], "title": success["title"]}), 200 if success["status"] else 500

@app.route('/youtube', methods=['GET'])
def getVideo(): 
    data = request.args.get('title') 
    list_of_videos = glob.glob('./Videos/*') # * means all if need specific format then *.csv
    latest_video = max(list_of_videos, key=os.path.getctime)
    latest_video_str = latest_video[9:]
    print(latest_video_str)
    try: 
        # send_from_directory if this doesn't work
        # C:\Users\User\OneDrive\Documents\Gogo Stuff\Coding Projects\Grid-Thing\python-flask\Videos
        # C:\Users\oscar\Documents\Entertainment\Coding Ideas\Grid-Thing\python-flask\Videos
        # "C:/Users/oscar/Documents/Entertainment/Coding Ideas/Grid-Thing/python-flask/Videos/"
        root_dir = os.path.dirname(os.path.abspath(__file__))
        # Construct the full path to the video file
        video_path = os.path.join(root_dir, 'Videos', latest_video_str)
        # print(video_path)
        return send_file(video_path, as_attachment=True, download_name=latest_video_str)
    except Exception as e: 
        return str(e)

if __name__ == '__main__':
    app.run(port=3001)
