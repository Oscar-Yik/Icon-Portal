# Use the official Python image from the Docker Hub
FROM python:3.9-alpine3.14

# Set the working directory
WORKDIR /app

# Install Git
RUN apk update && apk add git

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the entire application to the working directory
COPY . .

# Replace cipher.py line 264 with magic REGEX  
COPY cipher.py /usr/local/lib/python3.9/site-packages/pytube

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["flask", "run"]
