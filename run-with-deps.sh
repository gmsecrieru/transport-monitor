# build image
docker build -t transport-monitor .

# start dependency storage services
docker-compose -f ./docker-compose-deps.yml up -d

# caution: shameless hack motivation ahead
#
# Giving some reasonable time for the storage services to be
# ready for processing requests
echo "Waiting for storage services to be ready..."
sleep 30

# make sure `seeder` task runs prior to other services
docker run -it -e TASK_NAME=seeder transport-monitor

# start services
docker-compose up
