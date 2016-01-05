<?php
require_once($_SERVER['DOCUMENT_ROOT'] . "/d/danesc.php");
$danesc_session = new Danesc_session();
$row_current_session = $danesc_session->check_session();
//if($row_current_session == null) die();

$browser_type = get_browser_type();

$page_title = "Portal";

//Authcode : 4/Zn0dUeSY3mcKUj99ODjzdKsHUJKOGFHpLdu9AZAwkdQ.YlQvyZmB410b3oEBd8DOtNDjAr8SmwI
//Refresh token : 1/XH-ejzsNifSLBdzyBudmb3OkzFPjVo7guX1mLXGVyA4
//Access token : ya29.fgG5OTFdMxphfFBjNVCFoGj8px2LugkFsqM3fYVKBHHNMgjytQnHIHLgvoOPzqRyBAfFENZU147aJQ


// Call set_include_path() as needed to point to your client library.
set_include_path($_SERVER['DOCUMENT_ROOT'] . '/d/google-api-php-client/src');
require_once 'Google/Client.php';
require_once 'Google/autoload.php';
//require_once 'Google/Service.php';
//require_once 'Google/Service/Resource.php';
require_once 'Google/Service/YouTube.php';
session_start();


function generate_auth_token()
{
    /*
     * You can acquire an OAuth 2.0 client ID and client secret from the
     * {{ Google Cloud Console }} <{{ https://cloud.google.com/console }}>
     * For more information about using OAuth 2.0 to access Google APIs, please see:
     * <https://developers.google.com/youtube/v3/guides/authentication>
     * Please ensure that you have enabled the YouTube Data API for your project.
     */
    $OAUTH2_CLIENT_ID = '551670467589-p6m1p2mm6ekm4nuf013246bmn568dn13.apps.googleusercontent.com';
    $OAUTH2_CLIENT_SECRET = 'bTOhf2On51qySKaMbwMNaNly';
    $REDIRECT = 'https://www.imstrapd.com/upload_video.php';
    $APPNAME = "strapdapp2";


    $client = new Google_Client();
    $client->setClientId($OAUTH2_CLIENT_ID);
    $client->setClientSecret($OAUTH2_CLIENT_SECRET);
    $client->setScopes('https://www.googleapis.com/auth/youtube');
    $client->setRedirectUri($REDIRECT);
    $client->setApplicationName($APPNAME);
    $client->setAccessType('offline');


    // Define an object that will be used to make all API requests.
    $youtube = new Google_Service_YouTube($client);

    if (isset($_GET['code'])) {
        if (strval($_SESSION['state']) !== strval($_GET['state'])) {
            die('The session state did not match.');
        }

        $client->authenticate($_GET['code']);
        $_SESSION['token'] = $client->getAccessToken();

    }

    if (isset($_SESSION['token'])) {
        $client->setAccessToken($_SESSION['token']);
        echo '<code>' . $_SESSION['token'] . '</code>';
    }

    // Check to ensure that the access token was successfully acquired.
    if ($client->getAccessToken()) {
        try {
            // Call the channels.list method to retrieve information about the
            // currently authenticated user's channel.
            $channelsResponse = $youtube->channels->listChannels('contentDetails', array(
                'mine' => 'true',
            ));

            $htmlBody = '';
            foreach ($channelsResponse['items'] as $channel) {
                // Extract the unique playlist ID that identifies the list of videos
                // uploaded to the channel, and then call the playlistItems.list method
                // to retrieve that list.
                $uploadsListId = $channel['contentDetails']['relatedPlaylists']['uploads'];

                $playlistItemsResponse = $youtube->playlistItems->listPlaylistItems('snippet', array(
                    'playlistId' => $uploadsListId,
                    'maxResults' => 50
                ));

                $htmlBody .= "<h3>Videos in list $uploadsListId</h3><ul>";
                foreach ($playlistItemsResponse['items'] as $playlistItem) {
                    $htmlBody .= sprintf('<li>%s (%s)</li>', $playlistItem['snippet']['title'],
                        $playlistItem['snippet']['resourceId']['videoId']);
                }
                $htmlBody .= '</ul>';
            }
        } catch (Google_ServiceException $e) {
            $htmlBody .= sprintf('<p>A service error occurred: <code>%s</code></p>',
                htmlspecialchars($e->getMessage()));
        } catch (Google_Exception $e) {
            $htmlBody .= sprintf('<p>An client error occurred: <code>%s</code></p>',
                htmlspecialchars($e->getMessage()));
        }

        $_SESSION['token'] = $client->getAccessToken();
    } else {
        $state = mt_rand();
        $client->setState($state);
        $_SESSION['state'] = $state;

        $authUrl = $client->createAuthUrl();
        $htmlBody = '<h3>Authorization Required</h3>
            <p>You need to <a href="$authUrl">authorise access</a> before proceeding.<p>';
    }
    ?>

    <title>My Uploads</title>
    <?php
        echo $htmlBody;
}

function get_auth_token( $server )
{
    $file_path = $server['DOCUMENT_ROOT'] . '/d/google-api-php-client/the_key.txt';
    $key = file_get_contents( $file_path );
    $application_name = 'strapdapp2';
    $client_secret = 'bTOhf2On51qySKaMbwMNaNly';
    $client_id = '551670467589-p6m1p2mm6ekm4nuf013246bmn568dn13.apps.googleusercontent.com';
    $scope = array('https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtubepartner');

    try{
        // Client init
        $client = new Google_Client();
        $client->setApplicationName($application_name);
        $client->setClientId($client_id);
        $client->setAccessType('offline');
        $client->setAccessToken($key);
        $client->setScopes($scope);
        $client->setClientSecret($client_secret);

        if ($client->getAccessToken()) {

            /**
             * Check to see if our access token has expired. If so, get a new one and save it to file for future use.
             */
            if($client->isAccessTokenExpired()) {
                $newToken = json_decode($client->getAccessToken());
                $client->refreshToken($newToken->refresh_token);
                file_put_contents($file_path, $client->getAccessToken());
            }

            echo json_encode( array( 'status' => 'success', 'token_info' => $client->getAccessToken() ) );

        } else{
            // @TODO Log error
            //echo 'Problems creating the client';

            echo json_encode( array( 'status' => 'error', 'message' => 'There was a problem retrieving the access_token' ) );
        }

    } catch(Google_Service_Exception $e) {
        print "Caught Google service Exception ".$e->getCode(). " message is ".$e->getMessage();
        print "Stack trace is ".$e->getTraceAsString();
    }catch (Exception $e) {
        print "Caught Google service Exception ".$e->getCode(). " message is ".$e->getMessage();
        print "Stack trace is ".$e->getTraceAsString();
    }
}

function upload_video( $server )
{
    $file_path = $server['DOCUMENT_ROOT'] . '/d/google-api-php-client/the_key.txt';
    var_dump( $file_path );
    $key = file_get_contents( $file_path );
    $application_name = 'strapdapp2';
    $client_secret = 'bTOhf2On51qySKaMbwMNaNly';
    $client_id = '551670467589-p6m1p2mm6ekm4nuf013246bmn568dn13.apps.googleusercontent.com';
    $scope = array('https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtubepartner');

    $videoPath = $server['DOCUMENT_ROOT'] . '/d/google-api-php-client/IMG_7879.MOV';
    $videoTitle = "Test Video";
    $videoDescription = "Test Strapd Video";
    $videoCategory = "22";
    $videoTags = array("youtube", "tutorial");


    try{
        // Client init
        $client = new Google_Client();
        $client->setApplicationName($application_name);
        $client->setClientId($client_id);
        $client->setAccessType('offline');
        $client->setAccessToken($key);
        $client->setScopes($scope);
        $client->setClientSecret($client_secret);

        if ($client->getAccessToken()) {

            /**
             * Check to see if our access token has expired. If so, get a new one and save it to file for future use.
             */
            if($client->isAccessTokenExpired()) {
                var_dump( 'expired' );
                $newToken = json_decode($client->getAccessToken());
                $client->refreshToken($newToken->refresh_token);
                file_put_contents($file_path, $client->getAccessToken());
            }

            $youtube = new Google_Service_YouTube($client);



            // Create a snipet with title, description, tags and category id
            $snippet = new Google_Service_YouTube_VideoSnippet();
            $snippet->setTitle($videoTitle);
            $snippet->setDescription($videoDescription);
            $snippet->setCategoryId($videoCategory);
            $snippet->setTags($videoTags);

            // Create a video status with privacy status. Options are "public", "private" and "unlisted".
            $status = new Google_Service_YouTube_VideoStatus();
            $status->setPrivacyStatus('private');

            // Create a YouTube video with snippet and status
            $video = new Google_Service_YouTube_Video();
            $video->setSnippet($snippet);
            $video->setStatus($status);

            // Size of each chunk of data in bytes. Setting it higher leads faster upload (less chunks,
            // for reliable connections). Setting it lower leads better recovery (fine-grained chunks)
            $chunkSizeBytes = 1 * 1024 * 1024;

            // Setting the defer flag to true tells the client to return a request which can be called
            // with ->execute(); instead of making the API call immediately.
            $client->setDefer(true);

            // Create a request for the API's videos.insert method to create and upload the video.
            $insertRequest = $youtube->videos->insert("status,snippet", $video);

            var_dump( $insertRequest );

            // Create a MediaFileUpload object for resumable uploads.
            $media = new Google_Http_MediaFileUpload(
                $client,
                $insertRequest,
                'video/*',
                null,
                true,
                $chunkSizeBytes
            );
            $media->setFileSize(filesize($videoPath));


            // Read the media file and upload it chunk by chunk.
            $status = false;
            $handle = fopen($videoPath, "rb");
            while (!$status && !feof($handle)) {
                $chunk = fread($handle, $chunkSizeBytes);
                $status = $media->nextChunk($chunk);
            }

            fclose($handle);

            /**
             * Video has successfully been upload, now lets perform some cleanup functions for this video
             */
            if ($status->status['uploadStatus'] == 'uploaded') {
                // Actions to perform for a successful upload
                var_dump( 'Video uploaded' );
            }

            // If you want to make other calls after the file upload, set setDefer back to false
            $client->setDefer(true);

        } else{
            // @TODO Log error
            echo 'Problems creating the client';
        }

    } catch(Google_Service_Exception $e) {
        print "Caught Google service Exception ".$e->getCode(). " message is ".$e->getMessage();
        print "Stack trace is ".$e->getTraceAsString();
    }catch (Exception $e) {
        print "Caught Google service Exception ".$e->getCode(). " message is ".$e->getMessage();
        print "Stack trace is ".$e->getTraceAsString();
    }
    //$t = 'time';
    //echo $t;
}


if( $_REQUEST['method'] == 'get_auth' )
{
    get_auth_token( $_SERVER );
}

?>
