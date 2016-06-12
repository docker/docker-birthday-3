FROM garukun/godep:onbuild

ENV CGO_ENABLED=0

ENTRYPOINT ["go", "build", "-a", "-ldflags", "'-s'"]
