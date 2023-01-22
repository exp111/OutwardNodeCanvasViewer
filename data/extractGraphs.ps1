function convertFile
{
param (
        $Path
    )
Write-Host $Path
$content = (Get-Content $Path -Encoding UTF8 | Select-String -Pattern "^\s*_serializedGraph: '(.*)'$").Matches[0].Groups[1].Value.Trim();
$dir = (Get-Item $Path).DirectoryName;
$baseName = (Get-Item $Path).BaseName;
$newPath = Join-Path -Path $dir -ChildPath ($baseName + ".json")

Out-File -InputObject $content -FilePath $newPath -Encoding UTF8
}

$files = Get-ChildItem -Recurse | Where-Object {$_.Name -like "*.asset"}
foreach ($file in $files)
{
    convertFile $file.FullName
}