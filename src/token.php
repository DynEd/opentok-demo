<?php
require "./vendor/autoload.php";

use OpenTok\ArchiveMode;
use OpenTok\OpenTok;
use OpenTok\Role;
use OpenTok\MediaMode;

$apiKey = "45992642";
$secretKey = "c071e1e9cb983752fea257416b17e03209796a12";
$opentok = new OpenTok($apiKey, $secretKey);

$sessionOptions = array(
    'archiveMode' => ArchiveMode::ALWAYS,
    'mediaMode' => MediaMode::ROUTED
);
$session = $opentok->createSession($sessionOptions);
$sessionId = $session->getSessionId();

// Getnerate token coach
$tokenCoach = $opentok->generateToken($sessionId, array(
    'role' => Role::PUBLISHER,
    'data' => "username=CoachName",
    'initialLayoutClassList' => array('focus')
));

// Generate token student
$tokenStudent = $opentok->generateToken($sessionId, array(
    'role' => Role::PUBLISHER,
    'data' => "username=StudentName",
    'initialLayoutClassList' => array('focus')
));

$coachURL = "https://" . $_SERVER['SERVER_NAME'] . "/OpenTokJs/live.html?token=$tokenCoach&sessionId=$sessionId&name=COACHNAME";
$studentURL = "https://" . $_SERVER['SERVER_NAME'] . "/OpenTokJs/live.html?token=$tokenStudent&sessionId=$sessionId&name=STUDENTNAME";
