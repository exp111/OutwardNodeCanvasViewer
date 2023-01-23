# Get all files
$files = Get-ChildItem -Directory | foreach {Get-ChildItem -Recurse -Path $_ -File -Filter *.json}

$allTypes = @{}
foreach ($file in $files)
{
    $types = (Get-Content $file.FullName | Select-String -AllMatches -Pattern '"\$type":"(.*?)"').Matches | foreach {$_.Groups[1].Value}
    foreach ($type in $types)
    {
        # Type is indexed already? Add the current file
        if ($allTypes.ContainsKey($type))
        {
            # Only add file if its not there yet
            if (!$allTypes[$type].Contains($file.Name))
            {
                $a = $allTypes[$type].Add($file.Name);
            }
        }
        else # not indexed => add type + cur file
        {
            $list = [System.Collections.ArrayList]@($file.Name);
            $a = $allTypes.Add($type, $list);
        }
    }
}
$allTypes | ConvertTo-Json | Set-Content -Path "types.json"