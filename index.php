<?php
include_once "./src/token.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <!-- <script src="https://static.opentok.com/v2/js/opentok.min.js"></script> -->
    <!-- <script src="/dist/openvcall.server.js"></script> -->
    <title>openVcall</title>
</head>

<body>
    <div id="content" style="width: 100%;text-align: center;">
        <h1>Coach link:</h1>
        <input value="<?php echo $coachURL;?>" type="text" id="invite-link" style="width: 75%; height: 50px;text-align: center;font-size: 3em;border-radius: 15px;padding: 10px;">
    </div>

    <div id="content" style="width: 100%;text-align: center;">
        <h1>Student link:</h1>
        <input value="<?php echo $studentURL;?>" type="text" id="invite-link" style="width: 75%; height: 50px;text-align: center;font-size: 3em;border-radius: 15px;padding: 10px;">
    </div>
</body>

</html>