<?php
/**
 * Two Drifters - Virtual Museum
 * Main entry point: serves the React SPA
 * 
 * For Virtualmin 8.0.1 on Ubuntu 24.04.4
 * PHP 8.1+ required
 */

// If requesting a real file (JS, CSS, images, audio), let Apache serve it
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$filePath = __DIR__ . $requestUri;

if ($requestUri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false; // Let the web server handle it
}

// Otherwise serve the React SPA
$indexFile = __DIR__ . '/index.html';
if (file_exists($indexFile)) {
    readfile($indexFile);
    exit;
}

// Fallback if build hasn't been run
http_response_code(503);
echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Two Drifters</title>';
echo '<style>body{background:#060a14;color:#c9a84c;font-family:serif;display:flex;';
echo 'align-items:center;justify-content:center;min-height:100vh;text-align:center;}';
echo '</style></head><body><div><h1>Two Drifters</h1>';
echo '<p>The garden is being prepared. Please check back soon.</p></div></body></html>';
