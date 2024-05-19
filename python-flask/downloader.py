import pytube 
from concurrent.futures import ThreadPoolExecutor
import time 

def download_video (video):
    try: 
        video.streams.first().download('./Piano') 
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

    end_time = time.time() 
    elapsed_time = end_time - start_time 
    print(f'Elapsed Time: {round(elapsed_time, 2)} seconds')

def download_playlist (playlist_name): 
    if (playlist_name == 'Memes'):
        print(playlist_name)
        url = 'https://www.youtube.com/playlist?list=PLeNGYukLLCsrZQWSwHGbFMmQVN7gEQ14y'
        download_video_threads(url)
    elif (playlist_name == 'Piano'):
        print(playlist_name)
        url = 'https://www.youtube.com/playlist?list=PLeNGYukLLCspzXpXFLzyAINsp5mifHJjd'
        download_video_threads(url)
    else: 
        print("playlist isn't supported")

#download_playlist('Memes')
#download_playlist('Piano')