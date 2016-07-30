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
    
  
    $scope.getUserInventory = function(){
            $ionicLoading.show({
                template: 'Fetching Inventory...'
            });
            HttpService.getUserInventory($scope.lastName + ", " + $scope.firstName).then(function(data) {
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

.controller('ItemDescCtrl', function($scope,$state,MainService,Azureservice,$cordovaCamera,$ionicPopup,$cordovaImagePicker) {
    $scope.itemValues = MainService.itemValues;
    $scope.item = MainService.itemToDisplay;

    /* Uploading a Picture to the server */
    $scope.takePicture = function() {   
        /*Set Picture options: Right now the resolution is hardcoded*/
        var options = { 
            quality : 75, 
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
            $scope.showPopup(imageData);
        }, function(err) {
            alert('Could not take a Picture err: ' + err);
        });
    };

       /* Uploading a Picture to the server */
    $scope.openGallery = function() {   
        /*Set Picture options: Right now the resolution is hardcoded*/
        var options = { 
            quality : 75, 
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
    $scope.showPopup = function(imageData) {
        $scope.data = {};
    
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

    $scope.uploadNotesWithImage = function(imageData,notes){
        
        var item = {
            text          : $scope.item.Ptag,
            complete      : false,
            containerName : "todoitemimages",
            imageData     : imageData,
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

.controller('itemPictures', function($scope,$ionicModal,$http,Azureservice,MainService) {

   $scope.item = MainService.itemToDisplay;
   
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
                    $scope.allImages.push({src: response.data, notes : item.notes });
                    
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

