<?php
/**
 * Two Drifters: Deployment Diagnostic
 * Hit this at https://twodrifters.org/api/diag.php
 * DELETE THIS FILE after confirming the site works.
 */

header('Content-Type: text/plain; charset=utf-8');

echo "=== Two Drifters Deployment Diagnostic ===\n\n";

// 1. Document root
$docRoot = $_SERVER['DOCUMENT_ROOT'] ?? 'NOT SET';
echo "[1] DOCUMENT_ROOT: $docRoot\n";
echo "    Script location: " . __DIR__ . "\n";
echo "    Expected: /home/twodrifters/public_html/api\n\n";

// 2. Check critical files relative to document root
$checks = [
    'index.html'       => 'React SPA entry point',
    'index.php'        => 'PHP fallback router',
    '.htaccess'        => 'Apache rewrite rules (CRITICAL)',
    'assets/'          => 'Built JS/CSS directory',
    'api/contact.php'  => 'Contact form API',
    'audio/'           => 'Audio files directory',
    'audio/moonriver-syphonic.mp3' => 'Moon River audio file',
];

echo "[2] File existence check (relative to DOCUMENT_ROOT):\n";
foreach ($checks as $path => $desc) {
    $full = $docRoot . '/' . $path;
    $exists = file_exists($full);
    $size = $exists && is_file($full) ? ' (' . number_format(filesize($full)) . ' bytes)' : '';
    $icon = $exists ? 'OK' : 'MISSING';
    echo "    [$icon] $path$size  -- $desc\n";
}
echo "\n";

// 3. Check what's in assets/
$assetsDir = $docRoot . '/assets';
echo "[3] Contents of assets/ directory:\n";
if (is_dir($assetsDir)) {
    $files = scandir($assetsDir);
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        $size = filesize($assetsDir . '/' . $f);
        echo "    $f (" . number_format($size) . " bytes)\n";
    }
    if (count($files) <= 2) echo "    (EMPTY, this is the problem)\n";
} else {
    echo "    DIRECTORY NOT FOUND (this is the problem)\n";
}
echo "\n";

// 4. Apache modules
echo "[4] Apache modules (relevant ones):\n";
if (function_exists('apache_get_modules')) {
    $mods = apache_get_modules();
    $needed = ['mod_rewrite', 'mod_headers', 'mod_deflate', 'mod_expires'];
    foreach ($needed as $mod) {
        $loaded = in_array($mod, $mods) ? 'LOADED' : 'NOT LOADED';
        echo "    [$loaded] $mod\n";
    }
} else {
    echo "    Cannot detect (CGI/FPM mode). Check with: apache2ctl -M\n";
}
echo "\n";

// 5. PHP version
echo "[5] PHP: " . phpversion() . "\n";
echo "    Server API: " . php_sapi_name() . "\n\n";

// 6. Check AllowOverride by testing if .htaccess is effective
echo "[6] .htaccess rewrite test:\n";
$htaccess = $docRoot . '/.htaccess';
if (file_exists($htaccess)) {
    echo "    File exists (" . filesize($htaccess) . " bytes)\n";
    echo "    First 3 lines:\n";
    $lines = file($htaccess);
    for ($i = 0; $i < min(3, count($lines)); $i++) {
        echo "      " . trim($lines[$i]) . "\n";
    }
    echo "    If rewrites are NOT working, check that your Apache virtual host has:\n";
    echo "      <Directory /home/twodrifters/public_html>\n";
    echo "          AllowOverride All\n";
    echo "      </Directory>\n";
} else {
    echo "    .htaccess NOT FOUND. SPA routing will not work.\n";
    echo "    This is likely the main problem.\n";
}
echo "\n";

// 7. Directory listing of document root
echo "[7] Document root listing (top-level):\n";
if (is_dir($docRoot)) {
    $items = scandir($docRoot);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $type = is_dir($docRoot . '/' . $item) ? 'DIR ' : 'FILE';
        echo "    [$type] $item\n";
    }
} else {
    echo "    Cannot read document root\n";
}

echo "\n=== End Diagnostic ===\n";
echo "DELETE this file (api/diag.php) after the site is working.\n";
