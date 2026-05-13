Set WshShell = CreateObject("WScript.Shell")
' 0 means hide the window, True means wait for it to finish (we want False to let it run in background)
WshShell.Run "cmd.exe /c Launch_MailMind.bat", 0, False
Set WshShell = Nothing
