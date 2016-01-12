var app = angular.module('A',[]);

app.controller('datiLoad', function ($scope, $interval,$http){
            $scope.allrec = [];
            $scope.maxSpeed = 0;
            $scope.avgSpeed = 0;
            $scope.howSpeed = 0;
            $scope.howLong = 0;
            $scope.howHeight = 0;
            $scope.startTime = 0;
            $scope.timerSeconds = 0;
            $scope.howTime = "00 : 00 : 00";
            $scope.maxHeight = 0;
            $scope.ascending = 0;
            $scope.descending = 0;
            $scope.currRec = null;
            $scope.prevRec = null;
            $scope.serverAjax= "http://www.bacigalupo.it/riccardo/trackA.php";
            $scope.serverBookmark= "http://www.bacigalupo.it/riccardo/saveBookMark.php";
            
            $scope.scanTimer = null;
            $scope.sendTimer = null;
            $scope.scanTime=15000;
            $scope.sendTime=15000;
            $scope.userName="";
            $scope.languageValue="it";
    
            // $scope.pictureSource = navigator.camera.PictureSourceType;
            // $scope.destinationType = navigator.camera.DestinationType;
    
            if (localStorage.getItem("languageValue") !== null)
                $scope.languageValue= localStorage.getItem("languageValue");

            if (localStorage.getItem("serverAjax") !== null)
                $scope.serverAjax= localStorage.getItem("serverAjax");

            if (localStorage.getItem("serverBookmark") !== null)
                $scope.serverBookmark= localStorage.getItem("serverBookmark");

            if (localStorage.getItem("scanTime") !== null)
                $scope.scanTime= localStorage.getItem("scanTime");

            if (localStorage.getItem("sendTime") !== null)
                $scope.sendTime= localStorage.getItem("sendTime");         

            if (localStorage.getItem("userName") !== null)
                $scope.userName= localStorage.getItem("userName");         
 
            changeLanguage($scope.languageValue);

            var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");
    
            $('#buttonPref').click(function(e) {
                e.preventDefault();
                $("body").append(appendthis);
                $(".modal-overlay").fadeTo(500, 0.7);
                var modalBox = $(this).attr('data-modal-id');
                $('#scanT').val( $scope.scanTime );
                $('#sendT').val( $scope.sendTime );
                $('#'+modalBox).fadeIn($(this).data());
                $('#buttonPref').toggleClass('on');
            });  


            $(".js-modal-close, .modal-overlay").click(function() {
                var whichButton = $(this).attr('button-modal-id');
                $('#'+whichButton).toggleClass('on');
                $(".modal-box, .modal-overlay").fadeOut(500, function() {
                    $(".modal-overlay").remove();
                });
                // alert($(parent.this).html());
            });

            $(window).resize(function() {
                $(".modal-box").css({
                    top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
                    left: ($(window).width() - $(".modal-box").outerWidth()) / 2
                });
            });

            $(window).resize();
    
            var options = {
                timeout: 10000,
                maximumAge: 11000,
                enableHighAccuracy: true
            };
    
            $scope.idNav = navigator.geolocation.watchPosition(
                function(pos){
                    $scope.currRec = pos; 
                    $scope.currRec.coords.timestamp = formatDate(new Date(),"full");
                    $scope.currRec.coords.userName = $scope.userName;
                },
                function(err){
                    alert(err.code +" - "+ err.message);},
                options);
            
            $interval(function () {
                    
                    $scope.whatTime = formatDate(new Date(),"");
                      if (! backGroudMode){
                    // if ($scope.startTime > 0){
                        
                        var element = $scope.currRec.coords;
                        
                        $scope.howSpeed = Math.round(element.speed * 36) / 10;
                        $scope.howHeight = element.altitude;

                        if ($scope.startTime > 0){
                            $scope.timerSeconds = new Date() - $scope.startTime;
                            $scope.howTime = formatDate(new Date($scope.timerSeconds),"crono");
                            if($scope.maxSpeed < $scope.howSpeed) $scope.maxSpeed = $scope.howSpeed;
                            $scope.avgSpeed = 0;
                            if($scope.maxHeight < $scope.howHeight) $scope.maxHeight = $scope.howHeight;
                            if ($scope.prevRec !== null && 
                                ($scope.prevRec.latitude !== element.latitude || $scope.prevRec.longitude !== element.longitude)){
                                if($scope.prevRec.altitude > element.altitude)
                                    $scope.descending += ($scope.prevRec.altitude - element.altitude);
                                else
                                    $scope.ascending += (element.altitude - $scope.prevRec.altitude);

                                var rad = function(x) {return x*Math.PI/180;}; 
                                var R     = 6378.137;                 //Raggio terrestre in km (WGS84)
                                var lat1 = element.latitude;
                                var lat2 = $scope.prevRec.latitude;
                                var lon1 = element.longitude;
                                var lon2 = $scope.prevRec.longitude;
                                var dLat  = rad( lat2 - lat1 );
                                var dLong = rad( lon2 - lon1 );

                                var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                                var d = R * c;

                                $scope.howLong += d;
                                $scope.avgSpeed = $scope.howLong * 3600 / $scope.timerSeconds ;
                            }                        
                        }
                     } 
                        $scope.prevRec = element;
                    // }            
            }, 1000);
            
            $scope.salvaServer = function(salva){
                if (salva){
                    $scope.languageValue = $("#languageValue").val();
                    $scope.scanTime = $("#scanT").val();
                    $scope.sendTime = $("#sendT").val();
                    $scope.serverAjax = $("#serverAjax").val();  
                    $scope.serverBookmark = $("#serverBookmark").val();  
                    $scope.userName = $("#userName").val();  

                    localStorage.setItem("languageValue",$("#languageValue").val());
                    localStorage.setItem("scanTime",$("#scanT").val());
                    localStorage.setItem("sendTime",$("#sendT").val());
                    localStorage.setItem("serverAjax",$("#serverAjax").val());  
                    localStorage.setItem("serverBookmark",$("#serverBookmark").val());  
                    localStorage.setItem("userName",$("#userName").val()); 
                    changeLanguage($scope.languageValue);
                }
            };
    
            $scope.startStop = function(){
               if ($scope.startTime === 0){
                    cordova.plugins.backgroundMode.enable();
                    $('#button').toggleClass('on');
			        
                    $scope.startTime =  new Date();
                   
                    $scope.scanTimer = $interval(function () {
                        $scope.allrec.pushOne($scope.currRec);
                    }, $scope.scanTime);
                   
                    $scope.sendTimer = $interval(function () {
                       if ($scope.allrec.length > 0){
                            for(var i=0;i< $scope.allrec.length; i++){
                                var myUrl= $scope.serverAjax+"?"+jQuery.param($scope.allrec[i]);
                                jQuery.ajax({url: myUrl, 
                                             async: false}) 
                                .done(function(result){
                                    $scope.allrec.shift();
                                })
                                .fail(function( jqXHR, textStatus ) {
                                    console.log( "Request failed: " + textStatus );
                                });                            
                            }
                        }
                        if ($scope.scanTimer === null)
                            $interval.cancel($scope.sendTimer);
                    }, $scope.sendTime);
                   
               }else{
                   if (angular.isDefined($scope.scanTimer)) {
                        $interval.cancel($scope.scanTimer);
                        
                        $scope.startTime = 0;
                        $scope.timerSeconds = 0;
                        $scope.howTime = "00 : 00 : 00";

                        $scope.howSpeed = 0;
                        $scope.maxSpeed = 0;
                        $scope.avgSpeed = 0;

                        $scope.howLong = 0;

                        $scope.howHeight = 0;
                        $scope.maxHeight = 0;
                        $scope.ascending = 0;
                        $scope.descending = 0;
                        // $scope.idNav = null;
                        cordova.plugins.backgroundMode.disable();
                        $('#button').toggleClass('on');
                    }
               } 
            
            };
            
            $scope.allrec.pushOne = function(p) {
                var element = p.coords;
                $scope.allrec.push(element);
            };
    
// Upload the photo and the comment
            $scope.inviaFoto = function(salva){
                if (salva){
                    var img = document.getElementById('imageToSend');
                    var imageURI = img.src;
                    var options = new FileUploadOptions();
                    options.fileKey = "file";
                    options.fileName = $scope.currRec.coords.timestamp+"image.jpg";
                    options.mimeType = "image/jpeg";
                    var params = new Object();
                    options.params = params;
                    options.chunkedMode = false;
                    var ft = new FileTransfer();
                    var commento = encodeURIComponent($("#commentToSend").val())
                    var myUrl = $scope.serverBookmark +"?"+jQuery.param($scope.currRec.coords)+"&comment="+commento;
                    console.log("myUrl = " + myUrl);
                    ft.upload(imageURI, myUrl , win, fail,
                        options);
                }
            }

            function changeLanguage(lan) {
                if(lan ==="it"){
                    $scope.speedLabel="Velocità";
                    $scope.maxSpeedLabel="Max";
                    $scope.avgSpeedLabel="Med";
                    $scope.altitudeLabel="Altitudine";
                    $scope.maxAltitudeLabel="Max";
                    $scope.upDownLabel="Salita/Discesa";
                    $scope.distanceLabel="Distanza";
                    $scope.timeLabel="Ora";
                    $scope.elapsedLabel="Tempo";                    
                }
                if(lan ==="en"){
                    $scope.speedLabel="Speed";
                    $scope.maxSpeedLabel="Max";
                    $scope.avgSpeedLabel="Avg";
                    $scope.altitudeLabel="Altitude";
                    $scope.maxAltitudeLabel="Max";
                    $scope.upDownLabel="Up/Down";
                    $scope.distanceLabel="Distance";
                    $scope.timeLabel="Time";
                    $scope.elapsedLabel="Elapsed";                    
                }
            }
            function win(r) {
                var img = document.getElementById('imageToSend');
                img.src = "";
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
            }

            function fail(error) {
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            }
    
            function formatDate (ora, type){
                    var anno = ora.getFullYear();
                    var mese = ora.getMonth()+1;
                    var giorno = ora.getDate();
                    var hr = ora.getHours();
                    if (type === "crono")
                        hr --;
                    var min = ora.getMinutes();
                    var sec = ora.getSeconds();
                    var millisec = ora.getMilliseconds();
                    if (mese < 10){
                        mese = "0" + mese;
                    }
                    if (giorno < 10){
                        giorno = "0" + giorno;
                    }
                    if(hr < 10){
                        hr = "0" +hr;
                    }
                    if (min < 10){
                        min = "0" + min;
                    }
                    if (sec < 10){
                        sec = "0" + sec;
                    }
                    if (millisec < 100){
                        millisec = "00" + millisec;
                    }else{
                        if (millisec < 10){
                            millisec = "0" + millisec;
                        }
                    }
                
                if (type === "full")
                    return (anno + "" +mese + "" +giorno + "" +hr + "" + min + "" + sec + "" + millisec);
                else
                    return hr + " : " + min + " : " + sec;
            }

});
