# Fix session display in portal files

# Faculty Portal
$content = Get-Content "faculty-portal.php" -Raw -Encoding UTF8
$content = $content -replace '<div class="uname-d" id="uname">.*?</div>', '<div class="uname-d" id="uname"><?php echo htmlspecialchars($_SESSION[''name'']); ?></div>'
$content | Out-File "faculty-portal.php" -Encoding UTF8 -NoNewline

# Student Portal
$content = Get-Content "student-portal.php" -Raw -Encoding UTF8
$content = $content -replace '<div class="uname-d" id="uname">.*?</div>', '<div class="uname-d" id="uname"><?php echo htmlspecialchars($_SESSION[''name'']); ?></div>'
$content | Out-File "student-portal.php" -Encoding UTF8 -NoNewline

Write-Host "Session display fixed in all portals!"
