<?php
/**
 * Two Drifters - Contact Form API
 * POST /api/contact.php
 * 
 * Accepts JSON: { name, email, subject, message }
 * Sends email notification and stores submission
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Parse input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Validate
$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$subject = trim($input['subject'] ?? 'Contact from Two Drifters');
$message = trim($input['message'] ?? '');

$errors = [];
if (empty($name))    $errors[] = 'Name is required';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required';
if (empty($message)) $errors[] = 'Message is required';

// Basic honeypot / rate limiting
if (!empty($input['website'])) {
    // Bot detected (honeypot field)
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

// Sanitize
$name    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Store submission to file (fallback if no DB)
$logDir = __DIR__ . '/../data/contact';
if (!is_dir($logDir)) {
    mkdir($logDir, 0750, true);
}

$entry = [
    'timestamp' => date('c'),
    'name'      => $name,
    'email'     => $email,
    'subject'   => $subject,
    'message'   => $message,
    'ip'        => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
];

$logFile = $logDir . '/submissions.jsonl';
file_put_contents($logFile, json_encode($entry) . "\n", FILE_APPEND | LOCK_EX);

// Send email notification
// Configure the recipient address below
$to = 'admin@twodrifters.org';
$mailSubject = "[Two Drifters] $subject";
$mailBody = "New contact form submission:\n\n";
$mailBody .= "Name: $name\n";
$mailBody .= "Email: $email\n";
$mailBody .= "Subject: $subject\n\n";
$mailBody .= "Message:\n$message\n";
$mailBody .= "\n---\nSent from twodrifters.org contact form";

$headers = "From: noreply@twodrifters.org\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: TwoDrifters/1.0\r\n";

@mail($to, $mailSubject, $mailBody, $headers);

// Respond
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Thank you for your message.',
]);
