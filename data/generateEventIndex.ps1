# foreach event in Events
#  get all files that contain the eventuid
#  add those to a object

# Get all files
$files = Get-ChildItem -Directory | foreach {Get-ChildItem -Recurse -Path $_ -File -Filter *.json}
# Load events from json
$events = Get-Content "QuestEvents.json" | ConvertFrom-Json
Write-Host $events.Count Events
$array = foreach ($event in $events)
{
    # Search in all files for the eventuid, then put those file paths into a list of relative paths
    Write-Host $event.EventName
    $items = $files | Select-String $event.EventUID -List | ForEach {($_.Path | Resolve-Path -Relative).Replace(".\","").Replace("\","/")}
    # Add found files to an array
    $arr = @();
    $arr += $items;
    $prop = [ordered]@{
            "Name" = $event.EventUID
            "Files" = $arr
        }
    New-Object -Type PSCustomObject -Property $prop
}
$array | ConvertTo-Json -Compress | Set-Content -Path "eventIndex.json"