FROM java:latest

RUN /usr/bin/curl -L https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz | /bin/tar xz
RUN mkdir -p /var/lib/dynamodb

ENTRYPOINT ["/usr/bin/java", "-Djava.library.path=./DynamoDBLocal_lib", "-jar", "DynamoDBLocal.jar"]

CMD ["-help"]
