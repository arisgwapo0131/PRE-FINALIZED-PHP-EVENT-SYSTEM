# Remove all emojis from portal files
$ErrorActionPreference = "Continue"

$files = @(
    "admin-portal.php",
    "faculty-portal.php",
    "student-portal.php",
    "files (1)/admin-portal-php.js",
    "files (1)/faculty-portal-php.js",
    "files (1)/student-portal-php.js",
    "login.php"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Processing $file..."
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Remove icon spans in navigation and other places
        $content = $content -replace '<span class="ic">[^<]*</span>\s*', ''
        
        # Remove standalone emojis in divs
        $content = $content -replace '<div class="si">[^<]*</div>', '<div class="si"></div>'
        $content = $content -replace '<div class="uav">[^<]*</div>', '<div class="uav">U</div>'
        
        # Remove emojis from headings and text
        $content = $content -replace '[^\x00-\x7F]+', ''
        
        # Clean up multiple spaces
        $content = $content -replace '  +', ' '
        
        # Fix specific text replacements
        $content = $content -replace 'Pending Events  Awaiting Approval', 'Pending Events - Awaiting Approval'
        $content = $content -replace 'Post New Announcement', 'Post New Announcement'
        
        $content | Out-File $file -Encoding UTF8 -NoNewline
        Write-Host "  Cleaned $file"
    }
}

Write-Host "`nAll emojis removed successfully!"
