# Using official python runtime base image
FROM python:2.7-alpine

# contains pg_config which is needed for 
RUN apk add --update build-base postgresql-dev python-dev

# Set the application directory
WORKDIR /app

# Install our requirements.txt
ADD requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# The directory test-app on our host machine is shared with /app on our container

# Make port 80 available for links and/or publish
EXPOSE 80

# Define our command to be run when launching the container
CMD ["python", "app.py"]
