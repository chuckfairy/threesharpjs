<?php

$sceneData = json_decode($_POST["scene"]);

if( !$sceneData ) { echo "No scene posted"; }

$sceneJson = $sceneData->json;
$sceneUrl = $sceneData->url;

$bytes_written = file_put_contents( $sceneUrl, $sceneJson );

echo "Saved Scene wrote {$bytes_written} bytes";
