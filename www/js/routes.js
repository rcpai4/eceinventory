angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  
      
        
    .state('login', {
      url: '/page2',
      templateUrl: 'templates/login.html'
    })
        
      
    
      
        
    .state('inventory', {
      url: '/Inventory',
      templateUrl: 'templates/inventory.html'
    })
        
      
    
      
        
    .state('homePage', {
      url: '/homepage',
      templateUrl: 'templates/homePage.html'
    })
        
      
    
      
        
    .state('projector', {
      url: '/Projector',
      templateUrl: 'templates/projector.html'
    })
        
      
    
      
        
    .state('windowserver', {
      url: '/windowsServer',
      templateUrl: 'templates/windowserver.html'
    })
        
      
    
      
        
    .state('amazonKindle', {
      url: '/AmazonKindle',
      templateUrl: 'templates/amazonKindle.html'
    })
        
      
    
      
        
    .state('sCAN', {
      url: '/scanpage',
      templateUrl: 'templates/sCAN.html'
    })




    .state('InventoryList', {
      url: '/InventoryList',
      templateUrl: 'templates/InventoryList.html'
    })
    
    .state('ItemDesc', {
      url: '/ItemDesc',
      templateUrl: 'templates/ItemDesc.html'
    })

    .state('itemPictures', {
       url: '/itemPictures',
       templateUrl: 'templates/itemPictures.html'
    })

    .state('itemHistory', {
       url: '/itemHistory',
       templateUrl: 'templates/itemHistory.html'
    })
    
    ;

  // if none of the above states are matched, use this as the fallback
  
  $urlRouterProvider.otherwise('/page2');
  

  

});
