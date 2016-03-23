. .\build.ps1

# docker run -v "$($pwd)\voting-app:C:\app" -it voting-app
# docker run -it voting-app cmd

docker kill db redis voting-app worker result-app
docker rm -vf db redis voting-app worker result-app

$voting_port = 4005
$result_port = 4006

function Get-IP {
  param( [string]$container )
  $ip = ""
  while (-not ($ip)) {
    $ipconfig = $(docker exec -it $container ipconfig)
    $ip = $ipconfig | select-string IPv4 | %{$_ -replace "^.* ", ""}
    Write-Host xxx$($ip)xxx
    if (-not ($ip)) {
      Sleep 1
    }
  }
  Write-Host IP of $container is $ip
  return $ip
}

function Open-Port {
  param( [int]$port )
  if (!(Get-NetFirewallRule | where {$_.Name -eq "DockerPort$port"})) {
      New-NetFirewallRule -Name "DockerPort$port" -DisplayName "Docker on TCP/$port" -Protocol tcp -LocalPort $port -Action Allow -Enabled True
  }
}

Open-Port($voting_port)
Open-Port($result_port)

Write-Host Starting db
docker run --name db -d postgresql

Write-Host Starting redis
docker run --name redis -d redis

$redis_host = Get-IP("redis")
Write-Host Starting voting-app
docker run --name voting-app -d -e REDIS_HOST=$redis_host -e PORT=$voting_port voting-app
$voting_host = Get-IP("voting-app")

$db_host = Get-IP("db")
Write-Host Starting worker
docker run --name worker -d -e REDIS_HOST=$redis_host -e DB_HOST=$db_host worker

Write-Host Starting result-app
docker run --name result-app -d -e DB_HOST=$db_host -e PORT=$result_port result-app
$result_host = Get-IP("result-app")

Write-Host "voting-app is reachable at http://$($voting_host):$voting_port"
Write-Host "result-app is reachable at http://$($result_host):$result_port"
start "http://$($voting_host):$voting_port"
start "http://$($result_host):$result_port"
