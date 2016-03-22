. .\build.ps1

# docker run -v "$($pwd)\voting-app:C:\app" -it voting-app
# docker run -it voting-app cmd

docker kill db redis voting-app worker result-app
docker rm -vf db redis voting-app worker result-app

$db_host = "172.16.0.2"
$redis_host = "172.16.0.3"
$voting_port = 4005
$result_port = 4006

if (!(Get-NetFirewallRule | where {$_.Name -eq "DockerVotingApp"})) {
    New-NetFirewallRule -Name "DockerVotingApp" -DisplayName "Docker voting-app on TCP/$voting_port" -Protocol tcp -LocalPort $voting_port -Action Allow -Enabled True
}
if (!(Get-NetFirewallRule | where {$_.Name -eq "DockerVotingApp"})) {
    New-NetFirewallRule -Name "DockerVotingApp" -DisplayName "Docker voting-app on TCP/$result_port" -Protocol tcp -LocalPort $result_port -Action Allow -Enabled True
}

Write-Host Starting db
docker run --name db -d postgresql
Sleep 4
$ipconfig_db=$(docker exec -it postgresql ipconfig)
Write-Host $ipconfig_db

Write-Host Starting redis
docker run --name redis -d redis
Sleep 4
$ipconfig_redis=$(docker exec -it redis ipconfig)
Write-Host $ipconfig_redis

Write-Host Starting voting-app
docker run --name voting-app -d -e REDIS_HOST=$redis_host -e PORT=$voting_port voting-app

Write-Host Starting worker
docker run --name worker -d -e REDIS_HOST=$redis_host -e DB_HOST=$db_host worker

Write-Host Starting result-app
docker run --name result-app -d -e DB_HOST=$db_host -e PORT=$result_port result-app

start http://172.16.0.4:$voting_port
start http://172.16.0.6:$result_port
