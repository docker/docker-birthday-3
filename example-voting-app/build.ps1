docker build -t voting-app voting-app
docker build -t postgresql postgresql
docker build -t worker worker
docker build --no-cache -t result-app result-app
docker build -t postgresql postgresql
docker build -t redis redis
