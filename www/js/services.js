angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

.service('MainService', function(){
    return {

        itemValues :[],
    
        userInfo : {
                        name: "",
                        email:   "",
                        userid: "",
                   },

        userInventoryList : {
                        name: "",
                        inventoryList: {}
                   },

        itemToDisplay : {},
        
        setUserInfo: function(info){
            this.userInfo.name = info.name;
            this.userInfo.email = info.email;
            this.userInfo.userid = info.userID;
        },
        
        getUserInfo: function(){
            return this.userInfo;
        },

        setItemToDisplay: function(item){
            this.itemToDisplay = item;
            // Just wanted to make sure even if server changes the object we
            // can get the object member names dyanmically
            this.itemValues = [];
            for(var name in item) {
                this.itemValues.push(name);
            }
        }

    }
})
    
.service('HttpService', function($http,ApiEndpoint) {
 return {

   getUserInventory: function(name) {
     // $http returns a promise, which has a then function, which also returns a promise.
     //return $http.get('http://eceinventory.azurewebsites.net/api/items/users/Bailey, Scott')
     console.log('HttpService: ' + ApiEndpoint.url);
     return $http.get(ApiEndpoint.url + '/users/' +name)
       .then(function (response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Get Post', response);
         return response.data;
       });
   },

   getItemFromBarcode: function(barcode) {
     // $http returns a promise, which has a then function, which also returns a promise.
     //return $http.get('http://eceinventory.azurewebsites.net/api/Items/barcode/' + barcode)
     console.log('HttpService: ' + ApiEndpoint.url)
     return $http.get(ApiEndpoint.url + '/Items/' + barcode)
       .then(function (response) {
         // In the response, resp.data contains the result. Check the console to see all of the data returned.
         console.log('Get Post', response);
         return response.data;
       },
        function(data) {
        // Handle error here
         alert('Server Response ' + data.status);
         return;
        });
   }                  
 }
})

.service('BarcodeScannerService', function($cordovaBarcodeScanner) {
    return {  
        scanBarcode: function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                alert("Serv " + imageData.text);
                //console.log("Barcode Format -> " + imageData.format);
                //console.log("Cancelled -> " + imageData.cancelled);
                return imageData.text;
            }, function(error) {
                alert("Error" + error);
                console.log("An error happened -> " + error);
                return error;
            });
    }
   };
});

