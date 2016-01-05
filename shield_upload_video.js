/*
Copyright 2015 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var signinCallback = function ( result ){
  if(result.access_token) {
    console.log( result );
    var uploadVideo = new UploadVideo();
    uploadVideo.ready(result.access_token);
  }
};

var STATUS_POLLING_INTERVAL_MILLIS = 60 * 1000; // One minute.


/**
 * YouTube video uploader class
 *
 * @constructor
 */
var UploadVideo = function() {
  /**
   * The array of tags for the new YouTube video.
   *
   * @attribute tags
   * @type Array.<string>
   * @default ['google-cors-upload']
   */
  this.tags = [];

  /**
   * The numeric YouTube
   * [category id](https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.videoCategories.list?part=snippet&regionCode=us).
   *
   * @attribute categoryId
   * @type number
   * @default 22
   */
  this.categoryId = 22;

  /**
   * The id of the new video.
   *
   * @attribute videoId
   * @type string
   * @default ''
   */
  this.videoId = '';

  this.uploadStartTime = 0;
};


UploadVideo.prototype.ready = function(accessToken) {
  this.accessToken = accessToken;
  this.gapi = gapi;
  this.authenticated = true;
  this.gapi.client.request({
    path: '/youtube/v3/channels',
    params: {
      part: 'snippet',
      mine: true
    },
    callback: function(response) {
      if (response.error) {
        console.log(response.error.message);
      } else {
        //jQuery('#channel-name').text(response.items[0].snippet.title);
        //jQuery('#channel-thumbnail').attr('src', response.items[0].snippet.thumbnails.default.url);

        //jQuery('.pre-sign-in').hide();
        jQuery('.post-sign-in').show();
      }
    }.bind(this)
  });
  jQuery('#file').on("change", this.handleUploadClicked.bind(this));
};

/**
 * Uploads a video file to YouTube.
 *
 * @method uploadFile
 * @param {object} file File object corresponding to the video to upload.
 */
UploadVideo.prototype.uploadFile = function(file) {
    var userTags = jQuery('#tags').val().split(',');
    if( userTags.length > 0 )
    {
        userTags.forEach( function( tag ){
            this.tags.push( tag );
        }.bind( this ));
    }
  var metadata = {
    snippet: {
      title: jQuery('#title').val(),
      description: jQuery('#description').text(),
      tags: this.tags,
      categoryId: this.categoryId
    },
    status: {
      privacyStatus: 'private'//jQuery('#privacy-status option:selected').text()
    }
  };
  var uploader = new MediaUploader({
    baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
    file: file,
    token: this.accessToken,
    metadata: metadata,
    params: {
      part: Object.keys(metadata).join(',')
    },
    onError: function(data) {
      var message = data;
      // Assuming the error is raised by the YouTube API, data will be
      // a JSON string with error.message set. That may not be the
      // only time onError will be raised, though.
      try {
        var errorResponse = JSON.parse(data);
        message = errorResponse.error.message;
      } finally {
        alert(message);
        jQuery('#video_uploaded').val( '0' );
      }
    }.bind(this),
    onProgress: function(data) {
      var currentTime = Date.now();
      var bytesUploaded = data.loaded;
      var totalBytes = data.total;
      // The times are in millis, so we need to divide by 1000 to get seconds.
      var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
      var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
      var percentageComplete = (bytesUploaded * 100) / totalBytes;

      jQuery('#upload-progress').attr({
        value: bytesUploaded,
        max: totalBytes
      });

      jQuery('#percent-transferred').text(percentageComplete);
      jQuery('#bytes-transferred').text(bytesUploaded);
      jQuery('#total-bytes').text(totalBytes);

      jQuery('.during-upload').show();
    }.bind(this),
    onComplete: function(data) {
      var uploadResponse = JSON.parse(data);
      this.videoId = uploadResponse.id;
      //hidden input
      jQuery('.video_id').val(this.videoId);
      //span post-upload
      jQuery('#video_id').html(this.videoId);
      jQuery('.post-upload').show();
      var uploaded = uploadResponse.status.uploadStatus == 'uploaded' ? true : false;
      jQuery('.upload_success')[ uploaded ? 'show' : 'hide']();
      jQuery('.upload_error')[ uploaded ? 'hide' : 'show']();
      jQuery('#video_uploaded').val( uploaded ? '1' : '0' );
      //this.pollForVideoStatus();
    }.bind(this)
  });
  // This won't correspond to the *exact* start of the upload, but it should be close enough.
  this.uploadStartTime = Date.now();
  uploader.upload();
};

UploadVideo.prototype.handleUploadClicked = function() {
  var title = jQuery('#title').val();
  var description = jQuery('#description').text();
  if( title !== '' )
  {
      jQuery('.fileupload-button').attr('disabled', true);
      this.uploadFile(jQuery('#file').get(0).files[0]);
  }
  else
  {
        alert( 'Please make sure you have added a title for this entry.' );
  }
};

UploadVideo.prototype.pollForVideoStatus = function() {
  this.gapi.client.request({
    path: '/youtube/v3/videos',
    params: {
      part: 'status,player',
      id: this.videoId
    },
    callback: function(response) {
      if (response.error) {
        // The status polling failed.
        console.log(response.error.message);
        setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
      } else {
        var uploadStatus = response.items[0].status.uploadStatus;
        switch (uploadStatus) {
          // This is a non-final status, so we need to poll again.
          case 'uploaded':
            jQuery('#post-upload-status').append('<li>Upload status: ' + uploadStatus + '</li>');
            setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
            break;
          // The video was successfully transcoded and is available.
          case 'processed':
            jQuery('#player').append(response.items[0].player.embedHtml);
            jQuery('#post-upload-status').append('<li>Final status.</li>');
            break;
          // All other statuses indicate a permanent transcoding failure.
          default:
            jQuery('#post-upload-status').append('<li>Transcoding failed.</li>');
            break;
        }
      }
    }.bind(this)
  });
};
