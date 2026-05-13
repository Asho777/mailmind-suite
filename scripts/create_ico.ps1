Add-Type -AssemblyName System.Drawing
$imagePath = "e:\Projects Developed with Antigravity\Workspaces\Auto Emailer App\public\icon-512.png"
$icoPath = "e:\Projects Developed with Antigravity\Workspaces\Auto Emailer App\public\favicon.ico"

# Load the PNG
$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)

# Create a 256x256 version (Maximum size for Windows Icons)
$newBmp = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($newBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($bmp, 0, 0, 256, 256)
$g.Dispose()

# Convert to Icon
$hIcon = $newBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

# Save the Icon
$stream = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Close()

# Cleanup
$newBmp.Dispose()
$bmp.Dispose()
Write-Host "Success: Created high-quality favicon.ico"
