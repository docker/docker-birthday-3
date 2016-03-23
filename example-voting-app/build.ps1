docker build -t voting-app voting-app
docker build --no-cache -t worker worker
docker build -t result-app result-app
docker build -t postgresql postgresql
docker build -t redis redis
