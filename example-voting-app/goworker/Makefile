image=garukun/examplevotingapp_goworker
project=goworker

update:
	@echo "Updating external dependencies..."
	@docker run --rm -v `pwd`:/go/src/$(project) -w /go/src/$(project) garukun/godep /bin/sh -c "godep get ./... && godep save ./..."
	@# docker run --rm -v `pwd`:/go/src/$(project) -w /go/src/$(project) -it garukun/godep /bin/sh

build:
	@echo "Resolving external dependencies..."
	$(eval build_image := $(shell date | md5))
	@docker build --build-arg GO_PROJECT=$(project) -t $(build_image) .
	@echo "Compiling..."
	@docker run --rm -v `pwd`/_out:/out $(build_image) -o /out/$(project)
	@echo "Dockerizing..."
	@docker build -t $(image) -f _out/Dockerfile _out
	@docker rmi $(build_image)
	@rm _out/$(project)
	@echo "Done!"

push:
	@docker push $(image)
