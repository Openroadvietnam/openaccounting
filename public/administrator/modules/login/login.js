var loginModule = angular.module('loginModule',['ngRoute']);
loginModule.controller('loginController',['$scope','$rootScope','api','$cookieStore','$http','$location','user','Base64','$window','$interval',function($scope,$rootScope,api,$cookieStore,$http,$location,user,Base64,$window,$interval){
	$cookieStore.remove('token');
	$cookieStore.remove('id_app');
	$rootScope.app_info =undefined;
	$rootScope.isLogined = false;
	id_app =undefined;
	$rootScope.id_app = undefined;
	$rootScope.user = undefined;
	api.init();
	$scope.data ={};
	$scope.auth_google = function(){
		var w =$window.open("/auth/google" ,"Google authentication",'height=400,width=400');
		var interval = $interval(function(){
			try{
				if(w.location.href && w.location.href.indexOf("/auth/google/callback")){
					if(w.document.body.innerHTML && w.document.body.innerHTML.indexOf("access_token")>=0){
						var access_token = w.document.title;
						$interval.cancel(interval);
						w.close();
						//
						$cookieStore.put('token', access_token);
						api.init(access_token);
						user.getInfo(function(user){
							$location.url("/app");
						});
					}
				}
			}catch(e){
			}
			
		},500);
	}
	$scope.auth_facebook = function(){
		var w =$window.open("/auth/facebook" ,"Facebook authentication",'height=400,width=400');
		var interval = $interval(function(){
			try{
				if(w.location.href && w.location.href.indexOf("/auth/facebook/callback")){
					if(w.document.body.innerHTML && w.document.body.innerHTML.indexOf("access_token")>=0){
						var access_token = w.document.title;
						$interval.cancel(interval);
						w.close();
						//
						$cookieStore.put('token', access_token);
						api.init(access_token);
						user.getInfo(function(user){
							$location.url("/app");
						});
					}
				}
			}catch(e){
			}
			
		},500);
	}
	$scope.auth_local = function(){	
		var url ="/auth/local";
		var Authorization ="Basic " + Base64.encode($scope.data.username + ':' + $scope.data.password);
		$http.get(url,{headers:{Authorization:Authorization}}).success(function(token){
			$cookieStore.put('token', token);
			api.init(token);
			user.getInfo(function(user){
				$location.url("/app");
			});
		}).error(function(error){
			$scope.messageError = error;
		});
	}
	$scope.signup = function(){
		$location.url("/signup");
	}
}]);
loginModule.controller('signupController',['$scope','$rootScope','api','$cookieStore','$http','$location',function($scope,$rootScope,api,$cookieStore,$http,$location){
	$cookieStore.remove('token');
	$cookieStore.remove('id_app');
	$rootScope.app_info =undefined;
	id_app =undefined;
	$rootScope.id_app = undefined;
	$rootScope.isLogined = false;
	api.init();
	$scope.data = {};
	$scope.signup = function(){
		var url = "/signup";
		$http.post(url,$scope.data)
		.success(function(data){
			$scope.alertType ="alert alert-success"
			$scope.messageError = data;
			$scope.data = {};
		})
		.error(function(error){
			$scope.alertType ="alert alert-danger"
			$scope.messageError = error;
		});
	}
}]);
var socket;
function socketConnect () {
  socket = io();
  socket.connected = false;
  socket.addEventListener('open', function () {
	console.log("Socket đã mở")
    this.connected = true;
  });
  socket.addEventListener('close', function () {
    if (!this.connected) {
	  console.log("Socket đang kết nối lại")
      socketConnect();
    }
  });
  

}
loginModule.factory("user",['$http','$cookies','$rootScope','ngToast','$location',function($http,$cookies,$rootScope,ngToast,$location){
	return {
		getInfo:function(fn){
			$http.get("/api/user").success(function(user){
				$rootScope.error =undefined;
				$rootScope.user = user;
				socketConnect();
				// Add a connect listener
				socket.on('connect',function() {
				  var token =user.token;
				  if(token){ 
					socket.emit("login",{token:token,email:user.email});
				  }
				});
				// Add a connect listener
				socket.on('notifies_count',function(data) {
				  $rootScope.notifies_count = data;
				  if(data>0){
					ngToast.create('Bạn có ' + $rootScope.notifies_count + ' thông báo mới');
				  }
				  $rootScope.$apply();
				  
				});
				// Add a connect listener
				socket.on('messages_count',function(data) {
				  $rootScope.messages_count = data;
				  if(data>0){
					ngToast.create('Bạn có ' + $rootScope.messages_count + ' tin nhắn mới');
				  }
				  $rootScope.$apply();
				  
				  
				});
				// Add a disconnect listener
				socket.on('disconnect',function() {
				  //alert('The client has disconnected!');
				});
				
				fn(null,user);
			}).error(function(error){
				if(!error){
					error="Không thể kết nối với máy chủ";
				}
				$rootScope.error = error;
				$rootScope.user = undefined;
				fn(error);
				$location.url("login");
				
			});
		},
		getProfile:function(email,fn){
			var url = "/api/profile?email=" + email;
			$http.get(url).success(function(profile){
				fn(null,profile);
			}).error(function(error){
				fn(error);
			});
		}
		,
		getProfileByToken:function(fn){
			var url = "/api/profile";
			$http.get(url).success(function(profile){
				fn(null,profile);
			}).error(function(error){
				fn(error);
			});
		},
		updateProfile:function(profile,fn){
			var url = "/api/updateprofile";
			$http.post(url,profile).success(function(profile){
				fn(null,profile);
			}).error(function(error){
				fn(error);
			});
		},
		updatePassword:function(passwords,fn){
			var url = "/api/changepassword";
			$http.post(url,passwords).success(function(password){
				fn(null,password);
			}).error(function(error){
				fn(error);
			});
		},
		resetPassword:function(email,fn){
			var url = "/resetpassword?email=" + email;
			$http.get(url).success(function(info){
				fn(null,info);
			}).error(function(error){
				fn(error);
			});
		},
		getNotifies:function(fn){
			var url = "/api/notifies";
			$http.get(url).success(function(notifies){
				fn(null,notifies);
			}).error(function(error){
				fn(error);
			});
		},
		getMessagesColleagues:function(fn,unread){
			
			var url = "/api/message/colleague/latest";
			$http.get(url).success(function(colleagues){
				fn(null,colleagues);
			}).error(function(error){
				fn(error);
			});
		},
		logout:function(fn){
			if(!$cookies.token){
				return fn;
			}
			$http.get("/api/user/logout").success(function(d){
				fn(d);
			}).error(function(error){
				fn();
			});
		}
	}
}]);
loginModule.controller('uploadController',['$scope','user','$cookies','$rootScope','$location','app','$window','$routeParams',function($scope,user,$cookies,$rootScope,$location,app,$window,$routeParams){
	var folder = $routeParams.folder;
	$scope.action = "/api/uploadfile?access_token=" + eval("(" + $cookies.token + ")") + "&folder=" + folder;
}]);
loginModule.controller('uploadExcelController',['$scope','user','$cookies','$rootScope','$location','app','$window','$routeParams',function($scope,user,$cookies,$rootScope,$location,app,$window,$routeParams){
	$scope.action = "/api/uploadexcel?access_token=" + eval("(" + $cookies.token + ")");
}]);
loginModule.controller('profileController',['$scope','user','$cookies','$rootScope','$location','app','$window','$interval',function($scope,user,$cookies,$rootScope,$location,app,$window,$interval){
	checkIdApp("profile",$cookies,user,$rootScope,$location,app,function(error,uerinfo,appinfo){
		if(error){
			return;
		}
		$scope.access_token = eval("(" + $cookies.token + ")");
		user.getProfileByToken(function(error,profile){
			if(error) {
				$scope.alertType ="danger";
				return $scope.messageError = error;
			}
			$scope.alertType ="success";
			$scope.data = profile;
		});
		$scope.updateProfile = function(){
			user.updateProfile($scope.data,function(error){
				if(error) {
					 $scope.alertType ="danger";
					return $scope.messageError = error
				}
				$scope.alertType ="success";
				$scope.messageError = "Bạn đã cập nhật thành công!";
			});
		}
		$scope.updatePassword = function(){
			user.updatePassword({oldPassword:$scope.oldPassword,newPassword:$scope.newPassword,reNewPassword:$scope.reNewPassword},function(error){
				if(error) {
					 $scope.alertTypeChangePass ="danger";
					return $scope.messageErrorChangePass = error
				}
				$scope.alertTypeChangePass ="success";
				$scope.messageErrorChangePass = "Bạn đã thay đổi mật khẩu thành công!";
			});
		}
		$scope.changeAvatar = function(){
			var w = $window.open("#uploadfile/avatars","Upload file","width=600,height=300");
			var interval = $interval(function(){
				if(w.document.body.innerHTML=="success"){
					$scope.data.picture = w.document.title;
					$rootScope.user.picture = $scope.data.picture;
					w.close();
					$interval.cancel(interval);
				}
			},100);
			
		}
	});
	
}]);
loginModule.controller('resetPasswordController',['$scope','user','$cookies','$rootScope','$location','app',function($scope,user,$cookies,$rootScope,$location,app){
	$scope.resetPassword = function(){
		user.resetPassword($scope.email,function(error,info){
			if(error){
				$scope.alertType ="alert alert-danger";
				$scope.messageError = error;
			}else{
				$scope.alertType ="alert alert-success";
				$scope.messageError = info;
			}
		});
	}
}]);

loginModule.controller('logoutController',['$scope','$cookieStore','api','$location','$rootScope','user','$window','$timeout',function($scope,$cookieStore,api,$location,$rootScope,user,$window,$timeout){
	user.logout(function(d){
		//var token = $cookies.token;
		$cookieStore.remove('token');
		$cookieStore.remove('id_app');
		$rootScope.app_info =undefined;
		$rootScope.isLogined = false;
		id_app =null;
		$rootScope.id_app = undefined;
		api.init();
		$location.url("/login");
		if($rootScope.user){
			var url;
			if($rootScope.user.server=='google'){
				url = "https://mail.google.com/mail/u/0/?logout&hl=en";
			}
			if($rootScope.user.server=='facebook'){
				//url = "https://facebook.com/logout.php?next=http://localhost:8000&access_token=" + token;
			}
			$rootScope.user = undefined;
			if(url){
				var w = $window.open(url,"Logout",'height=400,width=400');
				$timeout(function(){
					w.close();
				},2000);
			}
		}
		
	});
	
	
}]);
loginModule.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider
			.when("/signup",{
				templateUrl:"modules/login/templates/signup.html",
				controller:"signupController"
			})
			.when("/resetpassword",{
				templateUrl:"modules/login/templates/resetpassword.html",
				controller:"resetPasswordController"
			})
			.when("/profile",{
				templateUrl:"modules/login/templates/profile.html",
				controller:"profileController"
			})
			.when("/login",{
				templateUrl:"modules/login/templates/login.html",
				controller:"loginController"
			})
			.when("/login/callback",{
				templateUrl:"modules/login/templates/callback.html",
				controller:"loginCallbackController"
			})
			.when("/logout",{
				templateUrl:"modules/login/templates/callback.html",
				controller:"logoutController"
			})
			.when("/uploadfile/:folder",{
				templateUrl:"modules/login/templates/upload.html",
				controller:"uploadController"
			})
			.when("/uploadexcel",{
				templateUrl:"modules/login/templates/upload.html",
				controller:"uploadExcelController"
			});
}]);