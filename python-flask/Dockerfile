# Use the official Python image from the Docker Hub
FROM python:3.9-alpine3.14

# Set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install Git
RUN apk update && apk add git

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install -r requirements.txt

# idk why this works
RUN pip uninstall -y pytube

# This might be magic
RUN pip install git+https://github.com/pytube/pytube@a32fff39058a6f7e5e59ecd06a7467b71197ce35

# Copy the entire application to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["flask", "run"]
