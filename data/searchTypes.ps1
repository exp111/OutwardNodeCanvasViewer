# Get all files
$files = Get-ChildItem -Directory | foreach {Get-ChildItem -Recurse -Path $_ -File -Filter *.json}

$types = foreach ($file in $files)
{
    (Get-Content $file.FullName | Select-String -AllMatches -Pattern '"\$type":"(.*?)"').Matches | foreach {$_.Groups[1].Value}
}
$types | Select-Object -Unique