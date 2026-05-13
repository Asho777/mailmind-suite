Add-Type -AssemblyName System.Drawing
$src = "e:\Projects Developed with Antigravity\Workspaces\Auto Emailer App\public\icon-512.png"
$dest = "e:\Projects Developed with Antigravity\Workspaces\Auto Emailer App\public\mailmind_app.ico"

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$newBmp = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($bmp, 0, 0, 256, 256)
$g.Dispose()

$hIcon = $newBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

$fs = [System.IO.File]::Create($dest)
$icon.Save($fs)
$fs.Close()

$newBmp.Dispose()
$bmp.Dispose()
Write-Host "Created mailmind_app.ico successfully"
