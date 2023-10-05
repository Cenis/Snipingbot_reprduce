var app = angular.module("myapp", []);

app.controller("ctrl", function($scope, $http, $q, $filter, $interval, $timeout, $sce) {

    var s = $scope;

    var tab = {};
    $scope.f1 = {};

    $scope.s = {};
		$scope.checkoutLink = "https://snipesensei.com/";

    $scope.save = function(createContext, successMsg) {
        chrome.storage.local.set({
            settings: $scope.s
        }, function() {});
        if (successMsg) {
            toastr.success(successMsg);
        }
    }


    chrome.storage.local.get(["settings","license","endpoint"], function(t) {
				$scope.$apply(function(){
					$scope.endpoint = t.endpoint;
				})

        if ("settings" in t) {
            $scope.$apply(function() {
                $scope.s = t.settings;
            })
        }
				if("license" in t){
					$scope.$apply(function(){
						$scope.license = t.license;
						$scope.f1.license_key = $scope.license.license_key;
						$scope.verifyLicense();
					})
				}
    })


    toastr.options.positionClass = "toast-bottom-right";


    $scope.ajax = function(d) {
        var defer = $q.defer();

        $http({
            method: "post",
            url: $scope.endpoint+"master.php",
            data: $.param(d),
            headers: {
                'content-type': "application/x-www-form-urlencoded"
            }
        }).then(function(res) {
            defer.resolve(res.data);
        })

        return defer.promise;
    }

		$scope.verifyLicense = function(){
			var f1 = $scope.f1;
			f1.action = "verifyLicense";
			f1.loading = true;
			$scope.ajax(f1).then(function(res){
				f1.loading = false;
				if(res.status === "success"){
					$scope.license = res.data;
					chrome.storage.local.set({license:res.data});
				} else {
					chrome.storage.local.remove("license");
					toastr.error(res.message);
				}
			})
		}

		$scope.startProcess = function(){
			chrome.tabs.query({active:true,currentWindow:true},function(tabs){
				if(!tabs[0].url.match("ea.com/")){
					toastr.error("Please go to www.ea.com and try again");
					return false;
				}
				chrome.tabs.sendMessage(tabs[0].id,{msg:"startProcess"},function(){
					window.close();
				});
		  })
		}

		$scope.Logout = function(){
			chrome.storage.local.remove("license");
			$scope.license = false;
		}

		$scope.reloadWindow = function(){
			window.location.reload();
		}


})
