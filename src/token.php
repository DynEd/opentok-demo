<?php
require "./vendor/autoload.php";
use OpenTok\OpenTok;
use OpenTok\Role;
use OpenTok\MediaMode;
use OpenTok\ArchiveMode;

$apiKey = "45992642";
$secretKey = "c071e1e9cb983752fea257416b17e03209796a12";
$opentok = new OpenTok($apiKey, $secretKey);

$sessionOptions = array(
    'archiveMode' => ArchiveMode::ALWAYS,
    'mediaMode' => MediaMode::ROUTED
);
$session = $opentok->createSession();
$sessionId = $session->getSessionId();

$metaData = "username=Bob,userLevel=4"; // custom additional data that can added
$tokenOptions = array(
    'role' => Role::PUBLISHER, 
    'expireTime' => time()+(7 * 24 * 60 * 60),
    'data' => $metaData
);
// Replace with the correct session ID:
$token = $opentok->generateToken($sessionId, $tokenOptions);

$invitedURL = "https://".$_SERVER['SERVER_NAME']."/opentok/live.html?token=$token&sessionId=$sessionId";