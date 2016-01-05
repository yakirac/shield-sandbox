<?php
// Call set_include_path() as needed to point to your client library.
set_include_path($_SERVER['DOCUMENT_ROOT'] . '/server/google-api-php-client/src');
require_once 'Google/Client.php';
require_once 'Google/autoload.php';
require_once 'Google/Service/YouTube.php';

$youtube_url_temp = isset($_POST['youtube_url_temp']) ? $_POST['youtube_url_temp'] : $_GET['youtube_url_temp'];

function validateURL( $yurl )
{
    /*
       * Set $DEVELOPER_KEY to the "API key" value from the "Access" tab of the
      * Google Developers Console <https://console.developers.google.com/>
      * Please ensure that you have enabled the YouTube Data API for your project.
      */
    $DEVELOPER_KEY = 'AIzaSyAeoUNRyZKxrGPactqhgccaIxVTlImKGH4';

    $client = new Google_Client();
    $client->setDeveloperKey($DEVELOPER_KEY);

    // Define an object that will be used to make all API requests.
    $youtube = new Google_Service_YouTube($client);

    $error = "";
    $long = preg_match( '/:\/\/www.youtube.com/i', $yurl );
    $short = preg_match( '/:\/\/youtu.be/i', $yurl );
    if( !$long && !$short ) {
        $yurl = "";
        // send back to the upload area... invalid Youtube URL
        $error = "Invalid YouTube video. Please try again.";
    } else{
        // we seem to have a valid video...
        // let's try to extract the ID...
        if( $long )
        {
            $youtube_temp = preg_replace( '/.*?(v=)(.*)/is', '\\2', $yurl );
            $youtube_temp = preg_replace( '/&.*/is', '', $youtube_temp );
            $youtube_vars = split( "=", $youtube_temp );
            $youtube_id = $youtube_vars[0];
        }
        else if( $short )
        {
            $shortIdPos = strrpos( $yurl, '/' );
            if( $shortIdPos ) $youtube_id = substr( $yurl, $shortIdPos+1 );
        }

        //echo "<br><b>($youtube_temp)</b>";
        //echo "<br><b>($youtube_id)</b>";
        //echo "<br><b>$youtube_url_temp</b>";
        error_log( 'validateURL : ' . $yurl );
        if( $youtube_id != null ){
            // ADD TO DATABASE...
            // let's verify we can get info about this id from YouTube's APi
            $youtube_api = "https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=" . $youtube_id . "&key=AIzaSyAeoUNRyZKxrGPactqhgccaIxVTlImKGH4";
            //"http://gdata.youtube.com/feeds/api/videos/$youtube_id?v=2"
            $youtube_info = $youtube->videos->listVideos('contentDetails', array('id' => $youtube_id));//simplexml_load_file( $youtube_api );
            //var_dump( $youtube_info );
            //echo "<pre>";
            //var_dump($youtube_info);
            //echo "</pre>";
            if( $youtube_info['items'][0]->id != null ){
                // we have valid data!
                $vid_url = generate_youtube_video_url( $youtube_id );
                //$video_id = $row_current_session->users_id . "_" . $youtube_id;
                $youtube_url = $youtube_id;
                // id
                // published
                // title
                $title = $youtube_info->title;
                // link
                // author

                /*
                $duration = null; // not given by API
                $audio_channels = null;
                $audio_sample_rate = null;
                $video_bitrate = null;
                $audio_bitrate = null;
                $encoding_time = null;
                $profile_name = null;
                $encoding_progress = 100;
                $extname = "flv";
                $audio_codec = "flv";
                $file_size = null;
                $height = null;
                $width = null;
                $profile_id = "youtube";
                $path = null;
                $fps = null;
                */
            } else{
                // send back to the upload area... invalid Youtube URL
                $error = "<b>Invalid YouTube video. Please try again.</b>";
            }
        } else{
            // send back to the upload area... invalid Youtube URL
            $error = "<b>Invalid YouTube video. Please try again.</b>";
        }
    }

    if( empty( $error ) )
        $responseData = array( 'status' => 'success', 'youtubeURL' => $vid_url, 'id' => $youtube_id, 'userEnteredURL' => $yurl );
    else
        $responseData = array( 'status' => 'error', 'response' => $error, 'userEnteredURL' => $yurl );

    echo json_encode( $responseData );
}


if( $_REQUEST['action'] == 'url' )
{
    validateURL( $youtube_url_temp );
}

?>
