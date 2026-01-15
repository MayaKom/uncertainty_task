<?php
header('Content-Type: application/json; charset=utf-8');

// Only POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode(["ok" => false, "error" => "POST only"]);
  exit;
}

// Data dir
$DATA_DIR = __DIR__ . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "data";

// Ensure exists
if (!is_dir($DATA_DIR)) {
  @mkdir($DATA_DIR, 0777, true);
}

// Ensure writable
if (!is_writable($DATA_DIR)) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Data directory not writable by web server", "dataDir" => $DATA_DIR]);
  exit;
}

// Read incoming payload (JSON preferred, fallback to form POST)
$raw = file_get_contents("php://input");
$decoded = json_decode($raw, true);

if (!is_array($decoded)) {
  // Try form POST fallback
  if (isset($_POST["data"])) {
    $decoded = json_decode($_POST["data"], true);
  }
}

if (!is_array($decoded) || !isset($decoded["payload"])) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Invalid payload (expected JSON with payload)"]);
  exit;
}

$turkInfo = is_array($decoded["turkInfo"] ?? null) ? $decoded["turkInfo"] : [];
$meta     = is_array($decoded["meta"] ?? null) ? $decoded["meta"] : [];
$payload  = $decoded["payload"];

// Skip MTurk preview
if (($turkInfo["assignmentId"] ?? "") === "ASSIGNMENT_ID_NOT_AVAILABLE") {
  echo json_encode(["ok" => true, "skipped" => "preview"]);
  exit;
}

// Build safe filename parts
$assignmentId = (string)($turkInfo["assignmentId"] ?? "no-assignment");
$workerId     = (string)($turkInfo["workerId"] ?? "");
$workerHash   = $workerId !== "" ? hash("sha256", $workerId) : "no-worker";

$iso = gmdate("Y-m-d\TH-i-s\Z");        // safe for filenames (no colons)
$suffix = bin2hex(random_bytes(4));
$assignmentSafe = preg_replace('/[^A-Za-z0-9_\-]/', '_', $assignmentId);

$filename = "{$iso}_{$assignmentSafe}_{$workerHash}_{$suffix}.csv";
$filepath = $DATA_DIR . DIRECTORY_SEPARATOR . $filename;

// Build rows for CSV (one row per trial; participant/meta fields repeated)
$receivedAt = gmdate("c");

// Ensure payload is an array of rows; if it's a single object, wrap it
$payloadRows = $payload;
if (!is_array($payloadRows)) {
  $payloadRows = [];
}
$looksLikeList = array_keys($payloadRows) === range(0, count($payloadRows) - 1);
if (!$looksLikeList) {
  // associative array (single trial/object)
  $payloadRows = [$payloadRows];
}

$rows = [];
$headerKeys = [];

// Participant-level fields (flatten turkInfo + meta at top-level)
$base = [
  "receivedAt"   => $receivedAt,
  "assignmentId" => $assignmentId,
  "workerHash"   => $workerHash,
];

// Include all turkInfo + meta fields as columns
foreach ($turkInfo as $k => $v) {
  $key = "turk_" . $k;
  $base[$key] = (is_scalar($v) || $v === null) ? $v : json_encode($v, JSON_UNESCAPED_SLASHES);
}
foreach ($meta as $k => $v) {
  $key = "meta_" . $k;
  $base[$key] = (is_scalar($v) || $v === null) ? $v : json_encode($v, JSON_UNESCAPED_SLASHES);
}

// Build per-trial rows
foreach ($payloadRows as $i => $trial) {
  if (!is_array($trial)) continue;

  $row = $base;
  $row["trialIndex"] = $i;

  foreach ($trial as $k => $v) {
    $row[$k] = (is_scalar($v) || $v === null) ? $v : json_encode($v, JSON_UNESCAPED_SLASHES);
  }

  $rows[] = $row;

  // Track union of keys for a stable header
  foreach ($row as $k => $_) {
    $headerKeys[$k] = true;
  }
}

if (count($rows) === 0) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "No rows to save (payload empty or invalid)"]);
  exit;
}

// Write CSV atomically
$tmp = $filepath . ".tmp";
$fp = fopen($tmp, "w");
if ($fp === false) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Failed to open temp CSV file"]);
  exit;
}

// Header in a consistent order: base first, then everything else alphabetically
$header = array_keys($headerKeys);

// Put some important columns first if present
$priority = ["receivedAt","assignmentId","workerHash","trialIndex"];
$headerOrdered = [];
foreach ($priority as $p) {
  if (in_array($p, $header, true)) $headerOrdered[] = $p;
}
$rest = array_values(array_diff($header, $headerOrdered));
sort($rest);
$header = array_merge($headerOrdered, $rest);

fputcsv($fp, $header);

// Rows: ensure missing keys become empty cells
foreach ($rows as $row) {
  $line = [];
  foreach ($header as $col) {
    $line[] = $row[$col] ?? "";
  }
  fputcsv($fp, $line);
}

fclose($fp);

if (!rename($tmp, $filepath)) {
  @unlink($tmp);
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Failed to finalize save"]);
  exit;
}


// Append to a lightweight index log (CSV)
$indexPath = $DATA_DIR . DIRECTORY_SEPARATOR . "index.csv";
$line = [
  gmdate("c"),
  $filename,
  $assignmentId,
  $workerHash,
  $_SERVER["REMOTE_ADDR"] ?? ""
];
$fp = fopen($indexPath, "a");
if ($fp) {
  fputcsv($fp, $line);
  fclose($fp);
}

// Respond
$out = ["ok" => true, "savedAs" => $filename];

// Debug info only when requested
if (isset($_GET["debug"]) && $_GET["debug"] === "1") {
  $out["dataDir"] = realpath($DATA_DIR);
  $out["scriptDir"] = __DIR__;
  $out["filePath"] = $filepath;
}

echo json_encode($out);
