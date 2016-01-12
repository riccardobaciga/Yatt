var pictureSource; 
var destinationType; 
var backGroudMode = false; 

function onDeviceReady() {
    try {
    
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType; 

        cordova.plugins.backgroundMode.onactivate = function () {
            cordova.plugins.backgroundMode.configure({
                text:'Invio della posizione in corso..'
            });
            backGroudMode = true;
        };
        cordova.plugins.backgroundMode.ondeactivate = function() {
            backGroudMode = false;
        };

        navigator.splashscreen.hide();
    } catch (e) {}
    document.addEventListener("backbutton", onBackKeyDown, false);
}

document.addEventListener("deviceready", onDeviceReady, false);

function onBackKeyDown() {
    if($("#button").attr("class") !== "on")
        navigator.app.exitApp();
}

function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 80,
        targetWidth: 300,
        targetHeight: 400,
        destinationType: destinationType.FILE_URI,
        correctOrientation:true,
        saveToPhotoAlbum: true
    });
}
// A button will call this function
//

function onPhotoDataSuccess(imageURI) {
	preparePhoto(imageURI);
}
// Called when a photo is successfully retrieved
//

function onPhotoURISuccess(imageURI) {
	preparePhoto(imageURI);
}

// A button will call this function
//

function preparePhoto(urlStr){
    
    var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    var modalBox = "popPhoto";
    $('#'+modalBox).fadeIn($(this).data());
    $('#buttonCamera').toggleClass('on');
    $("#imageToSend").attr("src", urlStr);
}

function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 30,
        targetWidth: window.innerWidth,
        targetHeight: window.innerHeight,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}
// Called if something bad happens.
//

function onFail(message) {
    alert('Failed because: ' + message);
}