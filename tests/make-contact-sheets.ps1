param([string]$Version = "v06")
Add-Type -AssemblyName System.Drawing
$taskRoot = Split-Path -Parent $PSScriptRoot
foreach ($mode in @('desktop','mobile')) {
  $cellWidth = if ($mode -eq 'desktop') { 480 } else { 234 }
  $cellHeight = if ($mode -eq 'desktop') { 334 } else { 507 }
  for ($group=0; $group -lt 3; $group++) {
    $sheet = New-Object System.Drawing.Bitmap (3*$cellWidth),(2*$cellHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($sheet)
    $graphics.Clear([System.Drawing.Color]::FromArgb(40,32,49))
    for ($offset=0; $offset -lt 6; $offset++) {
      $number = ($group*6+$offset+1).ToString('00')
      $sourcePath = Join-Path $taskRoot "test-results/$Version-$mode-$number.png"
      $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
      $graphics.DrawImage($sourceImage,($offset%3)*$cellWidth,([int][math]::Floor($offset/3))*$cellHeight,$cellWidth,$cellHeight)
      $sourceImage.Dispose()
    }
    $graphics.Dispose()
    $sheet.Save((Join-Path $taskRoot "test-results/$Version-contact-$mode-$($group+1).png"),[System.Drawing.Imaging.ImageFormat]::Png)
    $sheet.Dispose()
  }
}
