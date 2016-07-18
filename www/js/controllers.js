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

.controller('ItemDescCtrl', function($scope,MainService) {
    $scope.itemValues = MainService.itemValues;
    $scope.item = MainService.itemToDisplay;
})
