[XML]$xml = Get-Content "QuestEvents.xml"

$prop = @{}
foreach ($family in $xml.QuestEventSave.EventSections.ChildNodes)
{
    foreach ($event in $family.Events.ChildNodes)
    {
        $subProp = [ordered]@{
            "Name" = $event.EventName
            "Description" = $event.Description
        }
        $obj = New-Object -Type PSCustomObject -Property $subProp
        $prop.Add($event.EventUID, $obj);
    }
}

$obj = New-Object -Type PSCustomObject -Property $prop
$obj | ConvertTo-Json -Compress | Set-Content -Path "QuestEvents.json"