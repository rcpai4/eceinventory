angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope,MainService,$ionicLoading,$state) {


    $scope.userInfo = {
                        name: "",
                        password: "",
                        email:   ""
                        };
    
    $scope.setUserInfo = function() {
      
        $ionicLoading.show({
            template: 'Logging in...'
        });

        window.plugins.googleplus.login(
        {},
        function (user_data) {
          console.log(user_data);

          //for the purpose of this example I will store user data on local storage
          MainService.setUserInfo({
            userID: user_data.userId,
            name: user_data.displayName,
            email: user_data.email,
            picture: user_data.imageUrl,
            accessToken: user_data.accessToken,
            idToken: user_data.idToken
          });

          $ionicLoading.hide();
          $state.go('homePage');
        },
        function (msg) {
          $ionicLoading.hide();
          console.log(msg);
        }
    )
    };
})
   
.controller('inventoryCtrl', function($scope,$state,MainService,HttpService,$ionicLoading) {
    $scope.lastName = "";
    $scope.firstName = "";
    var fullName = '';
  
    $scope.getUserInventory = function(){
        $ionicLoading.show({
            template: 'Fetching Inventory...'
        });
        if($scope.lastName == ""){
            fullName =   $scope.firstName;
        }
        else{
            fullName = $scope.lastName + ", " + $scope.firstName;
        }
        HttpService.getUserInventory(fullName).then(function(data) {
            //TODO: Handle other case
            MainService.userInventoryList.inventoryList = data;
            $ionicLoading.hide();
            $state.go('InventoryList');            
         });
    }

})
   
.controller('homePageCtrl', function($scope,MainService,BarcodeScannerService,$cordovaBarcodeScanner,HttpService,$state,$ionicLoading){
    $scope.userInfo = MainService.getUserInfo();
    $scope.barcode  = "";

    $scope.scanBarcode = function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                //alert("Serv " + imageData.text);
                console.log("Barcode Format -> " + imageData.format);
                console.log("Cancelled -> " + imageData.cancelled);
                $scope.barcode = imageData.text;

                $ionicLoading.show({
                        template: 'Fetching Data...'
                });
                HttpService.getItemFromBarcode($scope.barcode).then(function(data) {
                    //TODO: Handle other case
                    //alert(JSON.stringify(data));
                    $ionicLoading.hide();
                    MainService.setItemToDisplay(data[0]);
                    console.log(data);        
                    $state.go('ItemDesc');
                });

            }, function(error) {
                alert("Error" + error);
                console.log("An error happened -> " + error);
                $scope.barcode = "";
                $ionicLoading.hide();
            });
    }
       
})
   
.controller('projectorCtrl', function($scope) {

})
   
.controller('windowserverCtrl', function($scope) {

})
   
.controller('amazonKindleCtrl', function($scope) {

})
   
.controller('sCANCtrl', function($scope) {

})
 
.controller('InventoryListCtrl', function($scope,$state,MainService) {
    
    $scope.inventoryList = MainService.userInventoryList.inventoryList;

    $scope.setItemtoDisplay = function(index){
        console.log($scope.inventoryList[index]);
        MainService.setItemToDisplay($scope.inventoryList[index]);
        $state.go('ItemDesc');
    };
})

.controller('ItemDescCtrl', function($scope,$state,$http,MainService,Azureservice,$cordovaCamera,$ionicPopup,$cordovaImagePicker,$cordovaGeolocation,$ionicLoading,ApiEndpoint) {
    $scope.itemValues = MainService.itemValues;
    $scope.item = MainService.itemToDisplay;
    $scope.address = "N/A";
    
    // Triggered on a button click, or some other target
    $scope.TransferItem = function() {
        $scope.datas = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datas.transferee">',
            title: 'Enter Transferee Name',
            subTitle: 'Please note that input is case sensitive ',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>transfer</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.datas.transferee) {
                            e.preventDefault();
                        } else {
                            return $scope.datas.transferee;
                        }
                    }
                }
            ]
        });

    myPopup.then(function(res) {
        console.log('Tapped!', res);
        var d = new Date();
        var n = d.getTime();
        console.log('Sender ' + $scope.item["Custodian"]); 
        $http.post( ApiEndpoint.url + "/Transfers",
                    { Ptag    : $scope.item.Ptag, 
                      Sender  : $scope.item["Custodian"], 
                      Receiver: res,
                      Time    : n
                    }).then(function (res){
            console.log('Res ' + res); 
        },function(err){
           console.error('Err ' + err); 
        });
    });

 };
    
    $scope.displayHistory = function(){
        $state.go('itemHistory');        
    };
    /* Uploading a Picture to the server */
    $scope.takePicture = function() {   
        /*Set Picture options: Right now the resolution is hardcoded*/
        var options = { 
            quality : 80, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 480,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.showPopupWithLocation(imageData);
        }, function(err) {
            alert('Could not take a Picture err: ' + err);
        });
    };

       /* Uploading a Picture to the server */
    $scope.openGallery = function() {   
        /*Set Picture options: Right now the resolution is hardcoded*/
        var options = { 
            quality : 80, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 640,
            targetHeight: 480,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.showPopup(imageData);
        }, function(err) {
            alert('Could not take a Picture err: ' + err);
        });
    };

    // Triggered on a button click, or some other target
    $scope.showPopupWithLocation = function(imageData) {
        $scope.data = {};
        $scope.data.notes = "";
        $scope.address = "N/A";
    
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.notes">',
            title: 'Enter notes for the image',
            scope: $scope,
            buttons: [
                { text: 'Discard' },
                { 
                    text: 'Add Location',
                    type: 'button-positive',
                    onTap: function(e) {
                         $scope.getLocation();
                         e.preventDefault();
                    }
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.data.notes;
                    }
                }
            ]
        });

        myPopup.then(function(res) {
            console.log('Tapped!', res);
            $scope.uploadNotesWithImage(imageData,res);        
        });

    };

    // Triggered on a button click, or some other target
    $scope.showPopup = function(imageData) {
        $scope.data = {};
        $scope.data.notes = "";
        $scope.address = "N/A";
    
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.notes">',
            title: 'Enter notes for the image',
            scope: $scope,
            buttons: [
                { text: 'Discard' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        return $scope.data.notes;
                    }
                }
            ]
        });

        myPopup.then(function(res) {
            console.log('Tapped!', res);
            $scope.uploadNotesWithImage(imageData,res);        
        });

    };

    
    $scope.seePictures = function(){
        $state.go('itemPictures');
    };

    $scope.getLocation = function(){
       $ionicLoading.show({
            template: 'Fetching Address...'
       });

      var posOptions = {timeout: 30000, enableHighAccuracy: false, maximumAge:60000};
      $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat,long);
            var request = {
                latLng: latlng
            };
            
            geocoder.geocode(request, function(data, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  if (data[0] != null) {
                    //alert("address is: " + data[0].formatted_address);
                    $scope.address = data[0].formatted_address;
                  } else {
                    alert("No address available");
                  }
                }
                $ionicLoading.hide();
            });

        }, function(err) {
            // error
            console.log('Error to get Current Location : ' +JSON.stringify(err));
            $ionicLoading.hide();
        });
    }

    $scope.uploadNotesWithImage = function(imageData,notes){
        
        var item = {
            text          : $scope.item.Ptag,
            complete      : false,
            containerName : "todoitemimages",
            imageData     : imageData,
            address       : $scope.address,
            notes         : notes
        };

        Azureservice.insert('Todo',
            item)
        .then(function() {
            console.log('Insert successful');
        }, function(err) {
            console.error('Azure Error: ' + err);
        });

    };
})

.controller('itemPictures', function($scope,$ionicModal,$http,$ionicPopup,Azureservice,MainService,ApiEndpoint) {

   $scope.item = MainService.itemToDisplay;

   $scope.deletePicture = function(index){
        
       var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Image',
            template: 'Are you sure you want to delete this image?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure');
                
                Azureservice.del('Todo', {
                    id: $scope.allImages[index].id,
                    containerName: $scope.allImages[index].containerName
                })
                .then(function() {
                    console.log('Delete successful');
                    alert('Delete successful');
                    $scope.refreshImages();
                }, function(err) {
                    console.error('Azure Error: ' + err);
                    alert('Azure Error: ' + err);
                });
            } else {
                console.log('You are not sure');
            }
        });
   };

   $scope.showInfo = function(index){
        // An alert dialog
        var alertPopup = $ionicPopup.alert({
            title: 'Information',
            template:  '<p>Notes: ' + $scope.allImages[index].notes +'</p><p>Address: ' + $scope.allImages[index].address + '</p>' 
        });

       alertPopup.then(function(res) {
         console.log('Thank you ');
        });
    };
   
   $scope.allImages = [];

    $scope.refreshImages = function(){
       Azureservice.query('Todo', {
            criteria: {
                text: $scope.item.Ptag
            }
        })
        .then(function(items) {
            // Assigin the results to a $scope variable
            $scope.allImages = [];

            items.forEach(function(item){
                $http.get(item.imageUri).then(function(response) {
                    $scope.allImages.push({src: response.data, notes : item.notes, address : item.address , id : item.id, containerName: item.containerName, blobName: item.blobName});
                });
            });
            
        }, function(err) {
            console.error('There was an error quering Azure ' + err);
        });
    };
    
    $scope.showImages = function(index) {
        $scope.activeSlide = index;
        $scope.showModal('templates/image-popover.html');
    }

     $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    // Close the modal
    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
    };

    $scope.refreshImages();

})

.controller('itemHistory', function($scope,$http,ApiEndpoint,MainService) {
  $scope.transactions = [];
  $scope.item = MainService.itemToDisplay;

  $http.get( ApiEndpoint.url + "/Histories/" + $scope.item['Ptag']).then(function(response) {
      $scope.transactions = response.data;
      $scope.transactions.forEach(function(element,index,array){
          element.members = [];
          for(var name in element) {
                if(name != 'members')
                    element.members.push(name);
            }
      });
  });
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(transaction) {
    if ($scope.isGroupShown(transaction)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = transaction;
    }
  };
  $scope.isGroupShown = function(transaction) {
    return $scope.shownGroup === transaction;
  };    

})

