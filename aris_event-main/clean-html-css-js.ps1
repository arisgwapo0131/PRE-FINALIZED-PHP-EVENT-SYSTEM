# Remove all emojis from HTML, CSS, and JS files
$ErrorActionPreference = "Continue"

$files = @(
    "files (1)/admin-portal.html",
    "files (1)/admin-portal.css",
    "files (1)/admin-portal.js",
    "files (1)/faculty-portal.html",
    "files (1)/faculty-portal.css",
    "files (1)/faculty-portal.js",
    "files (1)/student-portal.html",
    "files (1)/student-portal.css",
    "files (1)/student-portal.js"
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
        $content = $content -replace '<div class="role-icon">[^<]*</div>', '<div class="role-icon"></div>'
        
        # Remove emojis from JavaScript strings
        $content = $content -replace "banIco\(c\)\s*\{[^}]+\}", "banIco(c) { return ''; }"
        
        # Remove all non-ASCII characters (emojis)
        $content = $content -replace '[^\x00-\x7F]+', ''
        
        # Clean up multiple spaces
        $content = $content -replace '  +', ' '
        
        # Fix common text issues
        $content = $content -replace 'Pending Events  Awaiting Approval', 'Pending Events - Awaiting Approval'
        $content = $content -replace 'Post New Announcement', 'Post New Announcement'
        $content = $content -replace 'Create New Event', 'Create New Event'
        
        $content | Out-File $file -Encoding UTF8 -NoNewline
        Write-Host "  Cleaned $file"
    } else {
        Write-Host "  Skipped $file (not found)"
    }
}

Write-Host "`nAll emojis removed from HTML, CSS, and JS files!"
