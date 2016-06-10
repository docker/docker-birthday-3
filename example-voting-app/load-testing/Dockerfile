# Using official python runtime base image
FROM python:2

# Set the application directory
WORKDIR /app

# Install our requirements.txt
ADD requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy our code from the current folder to /app inside the container
ADD . /app

# Make port 8089 available for links and/or publish
EXPOSE 8089

# Define our command to be run when launching the container
CMD ["locust"]
