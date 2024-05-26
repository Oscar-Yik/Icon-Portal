# Use the official Python image from the Docker Hub
FROM python:3.9-alpine3.14

# Set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the entire application to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["flask", "run"]
