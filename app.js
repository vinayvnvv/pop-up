var app = angular.module('TesterApp', []);





app.controller('mainCtrl', ['$scope', 'mcaPopUp', function($scope, mcaPopUp){

	console.log("called ctrl")
   
    $scope.text = "fsdfsdf";

    $scope.show = function() {
        console.log("showing..")
        mcaPopUp.show({
                          text:"This is text", 
                          clickOutSideClose: true, 
                          transparency:0.5,
                          buttonText:"Ok",
                          animation:true
                    });

    }

    $scope.close = function() {
      mcaPopUp.close();  
    }

  
	
}]);

app.service('mcaPopUp', ['$rootScope', '$compile', function($rootScope, $compile){
        $rootScope.mcaPopUp = {};

        this.show = function(options) {
           var body = angular.element(document.body);
           body.append($compile("<mca-pop-up></mca-pop-up>")($rootScope));
           var p = {};
           if(options.text == null || options.text == undefined) {
            console.error("Text is not defined in mcaPopUp!");
            return;
           }
           p.text = options.text;
           p.show = true;
           p.outside = ( (options.clickOutSideClose == true) ? true : false );
           p.dim = ( (options.transparency != undefined || options.transparency != null ) ? options.transparency : "" ) ;
           p.buttonText = ( (options.buttonText != undefined || options.buttonText != null ) ? options.buttonText : "Close" ) ;
           p.animation = ( (options.animation == false) ? false : true );


           //pass object
           $rootScope.mcaPopUp = p;
        }

        this.close = function() {
           var p = {};
           p.text = "";
           p.show = false;
           $rootScope.mcaPopUp = p;
        }
}])


app.directive('mcaPopUp', ['$rootScope', function($rootScope){
    return {
        scope:{},
        template: `
              <div class="pop-up x-y-center" ng-if="isMcaPopUp">
    
                    <div class="pop-up-dim" ng-click="closeFromOutSide()" style="{{dimStyle}}"></div>
                    <div class="pop-up-body" ng-class="{zoomIn:animation}">
                        <span class="mark-icon flipInY"></span>
                        <div class="text x-y-center">{{text}}</div>
                        <div class="actions x-y-center"><button ng-click="close()" style="text-transform:uppercase">{{buttonText}}</button></div>
                    
                    </div>

                </div>
        `,
        replace: false,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.isMcaPopUp = false;
            $scope.outside= false;

            $scope.show = function(p) {
              $scope.isMcaPopUp = true;
              $scope.text = p.text;
              $scope.outside = p.outside;
              $scope.buttonText = p.buttonText;
              $scope.animation = p.animation;


              //custome style
              $scope.dimStyle = "opacity:" + p.dim + ";";


            }

            $scope.closeFromOutSide = function() {
                if($scope.outside) $scope.close();
            }
            $scope.close = function() {
              $scope.isMcaPopUp = false;
              $scope.text = "";
              $rootScope.mcaPopUp = null;
              var e = angular.element(document.querySelector('mca-pop-up'));
              e.remove();
            }

                $scope.$watch(function() {
                      return $rootScope.mcaPopUp;
                    }, function() {
                        var p = $rootScope.mcaPopUp;
                        if(!p) return;
                        if(p.show == true) $scope.show(p);
                        else $scope.close();
                });
        }
    };
}]);








          