
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

#Open-Port($voting_port)
#Open-Port($result_port)
#Open-Port(5432)
#Open-Port(6379)

$voting_host = Get-IP("examplevotingapp_voting-app_1")
$result_host = Get-IP("examplevotingapp_result-app_1")

Write-Host "voting-app is reachable at http://$($voting_host):$voting_port"
Write-Host "result-app is reachable at http://$($result_host):$result_port"
start "http://$($voting_host)"
start "http://$($result_host)"
