<?php
/**
 * Contact form handler — emails the enquiry to Mr. Home.
 *
 * Called two ways:
 *   - fetch() from js/contact.js  (Accept: application/json) → JSON response
 *   - plain form POST when JS is off                          → redirect
 * On success the browser ends up on /thank-you, which fires the Meta "Lead" event.
 */

const TO_EMAIL   = 'info@mr-home.online';
const FROM_EMAIL = 'info@mr-home.online'; // must be a mailbox on our domain for deliverability

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(bool $ok, string $error = '', int $status = 200): void {
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    } else {
        header('Location: ' . ($ok ? '/thank-you' : '/contact?error=1'), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 'Method not allowed', 405);
}

// Honeypot: real visitors never see or fill this field. Pretend success so bots move on.
if (!empty($_POST['website'])) {
    respond(true);
}

function field(string $key, int $max): string {
    $v = trim((string)($_POST[$key] ?? ''));
    return mb_substr($v, 0, $max);
}
function oneLine(string $v): string {
    return preg_replace('/[\r\n]+/', ' ', $v);
}

$name     = oneLine(field('name', 120));
$phone    = oneLine(field('phone', 40));
$email    = oneLine(field('email', 160));
$role     = oneLine(field('role', 60));
$location = oneLine(field('location', 60));
$message  = field('message', 5000);

if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please fill in your name, phone and a valid email.', 422);
}

$body = "New enquiry from mr-home.online\n"
      . "--------------------------------\n"
      . "Name:     $name\n"
      . "Phone:    $phone\n"
      . "Email:    $email\n"
      . "I am a:   " . ($role ?: '-') . "\n"
      . "Location: " . ($location ?: '-') . "\n\n"
      . "Message:\n" . ($message ?: '-') . "\n\n"
      . "--------------------------------\n"
      . "Sent " . gmdate('Y-m-d H:i') . " UTC from " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$subject = '=?UTF-8?B?' . base64_encode("New website enquiry – $name") . '?=';
$headers = implode("\r\n", [
    'From: =?UTF-8?B?' . base64_encode('Mr. Home Website') . '?= <' . FROM_EMAIL . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$sent = mail(TO_EMAIL, $subject, $body, $headers, '-f' . FROM_EMAIL);

if (!$sent) {
    error_log('contact.php: mail() failed for ' . $email);
    respond(false, 'Sorry, something went wrong. Please call or WhatsApp us instead.', 500);
}

respond(true);
