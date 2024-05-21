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

def download_single_video (url):
    yt = YouTube(url)
    try: 
        yt.streams.first().download('./Videos')
    except pytube.exceptions.VideoUnavailable:
        return {"status": False, "title": yt.streams[0].title}
    else: 
        return {"status": True, "title": [yt.streams[0].title + ".mp4"]}


#download_playlist('Memes')
#download_playlist('Piano')