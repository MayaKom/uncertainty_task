<?php
// api/save.php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["ok" => false, "error" => "POST only"]);
  exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["payload"])) {
  http_response_code(400);
  echo json_encode(["ok" => false, "error" => "Missing payload"]);
  exit;
}

// Skip MTurk previews
$turkInfo = $data["turkInfo"] ?? [];
if (($turkInfo["assignmentId"] ?? "") === "ASSIGNMENT_ID_NOT_AVAILABLE") {
  echo json_encode(["ok" => true, "skipped" => "preview"]);
  exit;
}

// Optional: only save consenters
$meta = $data["meta"] ?? [];
if (isset($meta["consented"]) && $meta["consented"] === false) {
  echo json_encode(["ok" => true, "skipped" => "no_consent"]);
  exit;
}

// CHANGE THIS to a real path your server user can write to:
$DATA_DIR = __DIR__ . "/../data"; // Example: study1/data (ensure protected!)
if (!file_exists($DATA_DIR)) {
  mkdir($DATA_DIR, 0700, true);
}

// Hash workerId so you don't store raw identifiers by default
$workerId = $turkInfo["workerId"] ?? "";
$workerHash = $workerId ? hash("sha256", $workerId) : "no-worker";
$assignmentId = $turkInfo["assignmentId"] ?? "no-assignment";

$iso = gmdate("Y-m-d\TH-i-s\Z");
$suffix = bin2hex(random_bytes(4));

$filename = "{$iso}_{$assignmentId}_{$workerHash}_{$suffix}.json";
$filepath = $DATA_DIR . "/" . $filename;

// Atomic write
$tmp = $filepath . ".tmp";
file_put_contents($tmp, json_encode([
  "receivedAt" => gmdate("c"),
  "turk" => [
    "assignmentId" => $assignmentId,
    "hitId" => $turkInfo["hitId"] ?? null,
    "workerHash" => $workerHash
  ],
  "meta" => $meta,
  "payload" => $data["payload"]
], JSON_PRETTY_PRINT), LOCK_EX);

rename($tmp, $filepath);

echo json_encode(["ok" => true, "savedAs" => $filename]);
