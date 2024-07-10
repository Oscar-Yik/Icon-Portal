import pytube
from pytube import YouTube
from concurrent.futures import ThreadPoolExecutor
import time 

def download_video (video):
    try: 
        video.streams.first().download('./Videos') 
    except pytube.exceptions.VideoUnavailable: 
        print(f'Video: {video.title} is unavailable, skipping')
    else: 
        print(f'Downloading: {video.title}')

def download_video_threads (url):
    start_time = time.time()
    # Memes playlist
    # url = 'https://www.youtube.com/playlist?list=PLeNGYukLLCsrZQWSwHGbFMmQVN7gEQ14y'

    # Piano Music playlist
    # url = 'https://www.youtube.com/playlist?list=PLeNGYukLLCspzXpXFLzyAINsp5mifHJjd'

    playlist = pytube.Playlist(url)
    executor = ThreadPoolExecutor(max_workers=15)

    print(f'Downloading: {playlist.title}')

    executor.map(download_video, playlist.videos)
    executor.shutdown()

    playlistVideos = []
    for video in playlist.videos: 
        playlistVideos.append(video.streams[0].title + ".mp4")

    end_time = time.time() 
    elapsed_time = end_time - start_time 
    print(f'Elapsed Time: {round(elapsed_time, 2)} seconds')
    return playlistVideos

def download_playlist (playlist_name): 
    print(playlist_name)
    if (playlist_name == 'Memes'):
        url = 'https://www.youtube.com/playlist?list=PLeNGYukLLCsrZQWSwHGbFMmQVN7gEQ14y'
        download_video_threads(url)
    elif (playlist_name == 'Piano'):
        url = 'https://www.youtube.com/playlist?list=PLeNGYukLLCspzXpXFLzyAINsp5mifHJjd'
        download_video_threads(url)
    else: 
        playlist = download_video_threads(playlist_name)
    return {"status": True, "title": playlist}

# def save_video_to_db (title, mysql): 
#     with open('Videos/' + title, 'rb') as file:
#         binary_data = file.read()
#     query = "INSERT INTO videos (id, video_data) VALUES (%s, %s)"
#     cursor = mysql.connection.cursor()
#     cursor.execute(query, (title, binary_data))
#     mysql.connection.commit()
#     cursor.close()
#     print("saved video to db")

def download_single_video (url):
    # try: 
    yt = YouTube(url)
    # except AttributeError: 
    #     return {"status": False, "title": "couldn't scrape video" + yt.streams[0].title}
    try: 
        yt.streams.first().download('./Videos')
    except pytube.exceptions.VideoUnavailable:
        return {"status": False, "title": yt.streams[0].title}
    else: 
        # save_video_to_db(yt.streams[0].title + ".mp4", mysql)
        return {"status": True, "title": [yt.streams[0].title + ".mp4"]}
    # print(url)


#download_playlist('Memes')
# download_playlist('Piano')