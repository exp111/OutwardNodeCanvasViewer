function getIndex
{
param (
        $Path
    )

$files = Get-ChildItem $Path -Recurse | Where-Object {$_.Name -like "*.asset"}

# Only select name and 
return ($files | Select-Object -Property @{E={$_.Name.Split(".")[0]};L="Name"},@{E={($_.FullName | Resolve-Path -Relative).Replace(".\","").Replace("\","/")};L="Path"});
}

$dialogues = getIndex -Path "_dialogues"
$quests = getIndex -Path "_quests"
$trees = getIndex -Path "trees"

$res = New-Object PSObject;
Add-Member -InputObject $res -MemberType NoteProperty -Name "Dialogues" -Value $dialogues
Add-Member -InputObject $res -MemberType NoteProperty -Name "Quests" -Value $quests
Add-Member -InputObject $res -MemberType NoteProperty -Name "BehaviourTrees" -Value $trees

$json = $res | ConvertTo-Json -Compress
Out-File -InputObject $json -FilePath "index.json" -Encoding utf8