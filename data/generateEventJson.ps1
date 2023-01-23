[XML]$xml = Get-Content "QuestEvents.xml"

$array = foreach ($family in $xml.QuestEventSave.EventSections.ChildNodes)
{
    foreach ($event in $family.Events.ChildNodes)
    {
        $prop = [ordered]@{
            "EventUID" = $event.EventUID
            "EventName" = $event.EventName
            "Description" = $event.Description
        }
        New-Object -Type PSCustomObject -Property $prop
    }
}

$array | ConvertTo-Json -Compress | Set-Content -Path "QuestEvents.json"