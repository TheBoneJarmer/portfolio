docker image rm thebonejarmer/portfolio:website
docker rm thebonejarmer/portfolio:website
docker build -t thebonejarmer/portfolio:website .
docker push thebonejarmer/portfolio:website