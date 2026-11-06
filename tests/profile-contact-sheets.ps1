Add-Type -AssemblyName System.Drawing
$taskRoot = Split-Path -Parent $PSScriptRoot
foreach ($phase in @('before','after')) {
  foreach ($mode in @('desktop','mobile')) {
    $cellWidth = if ($mode -eq 'desktop') {480} else {234}
    $cellHeight = if ($mode -eq 'desktop') {334} else {507}
    $sheet = New-Object System.Drawing.Bitmap (3*$cellWidth),(2*$cellHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($sheet)
    $graphics.Clear([System.Drawing.Color]::FromArgb(40,32,49))
    for ($offset=0; $offset -lt 6; $offset++) {
      $number = $offset+10
      $sourcePath = Join-Path $taskRoot "test-results/profile-$phase-$mode-$number.png"
      $sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
      $graphics.DrawImage($sourceImage,($offset%3)*$cellWidth,([int][math]::Floor($offset/3))*$cellHeight,$cellWidth,$cellHeight)
      $sourceImage.Dispose()
    }
    $graphics.Dispose()
    $sheet.Save((Join-Path $taskRoot "test-results/profile-$phase-contact-$mode.png"),[System.Drawing.Imaging.ImageFormat]::Png)
    $sheet.Dispose()
  }
}
