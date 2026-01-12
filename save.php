<?php
// task/api/save.php

header('Content-Type: application/json; charset=utf-8');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["ok" => false, "error" => "POST only"]);
  exit;
}

// Read raw JSON
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Invalid JSON"]);
  exit;
}

// Validate expected shape
if (!isset($data["payload"])) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Missing payload"]);
  exit;
}

$turkInfo = $data["turkInfo"] ?? [];
$meta     = $data["meta"] ?? [];

// Skip MTurk previews (assignmentId not available)
if (($turkInfo["assignmentId"] ?? "") === "ASSIGNMENT_ID_NOT_AVAILABLE") {
  echo json_encode(["ok" => true, "skipped" => "preview"]);
  exit;
}

// Optional: skip if no consent (only if you want this behavior)
if (isset($meta["consented"]) && $meta["consented"] === false) {
  echo json_encode(["ok" => true, "skipped" => "no_consent"]);
  exit;
}

/**
 * Path assumes:
 *   parent/
 *     data/
 *     task/
 *       api/save.php
 */
$DATA_DIR = realpath(__DIR__ . "/../../data");
if ($DATA_DIR === false) {
  $DATA_DIR = __DIR__ . "/../../data";
}

// Create the data directory if needed
if (!file_exists($DATA_DIR)) {
  if (!mkdir($DATA_DIR, 0700, true)) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Failed to create data directory"]);
    exit;
  }
}

// Ensure writable
if (!is_writable($DATA_DIR)) {
  http_response_code(500);
  echo json_encode([
    "ok" => false,
    "error" => "Data directory not writable by web server",
    "dataDir" => $DATA_DIR
  ]);
  exit;
}

// Build a safe filename
$assignmentId = $turkInfo["assignmentId"] ?? "no-assignment";
$hitId        = $turkInfo["hitId"] ?? null;
$workerId     = $turkInfo["workerId"] ?? "";

// Hash workerId so you don't store raw workerId by default
$workerHash = $workerId ? hash("sha256", $workerId) : "no-worker";

// Timestamp + random suffix to avoid collisions
$iso = gmdate("Y-m-d\TH-i-s\Z"); // safe for filenames (no colons)
$suffix = bin2hex(random_bytes(4));

// Sanitize assignmentId for filesystem safety
$assignmentSafe = preg_replace('/[^A-Za-z0-9_\-]/', '_', $assignmentId);

$filename = "{$iso}_{$assignmentSafe}_{$workerHash}_{$suffix}.json";
$filepath = $DATA_DIR . DIRECTORY_SEPARATOR . $filename;

// Assemble record
$record = [
  "receivedAt" => gmdate("c"),
  "turk" => [
    "assignmentId" => $assignmentId,
    "hitId" => $hitId,
    "workerHash" => $workerHash
    // If you truly need raw IDs for payment disputes, you can store them explicitly:
    // "workerId" => $workerId
  ],
  "meta" => $meta,
  "payload" => $data["payload"]
];

// Encode JSON
$json = json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
if ($json === false) {
  http_response_code(500);
  echo json_encode([
    "ok" => false,
    "error" => "JSON encoding failed",
    "jsonError" => json_last_error_msg()
  ]);
  exit;
}

// Atomic write: write temp then rename
$tmp = $filepath . ".tmp";
if (file_put_contents($tmp, $json, LOCK_EX) === false) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Failed to write temp file"]);
  exit;
}

if (!rename($tmp, $filepath)) {
  @unlink($tmp);
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Failed to finalize save"]);
  exit;
}

echo json_encode(["ok" => true, "savedAs" => $filename]);
