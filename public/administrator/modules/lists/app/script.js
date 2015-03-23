var appModule = new baseInput('app','app',["name"],'Danh sách công ty',"lists",function($http){
	var sv ={
		active:function(id){
					return $http.get("/api/app/active/" + id );
				},
		notaccept:function(id){
			return $http.get("/api/app/notaccept/" + id );
		}
	}
	return sv;
	
});
appModule.defaultValues = {
	ngay_dn:new Date( 2014,0,1),
	ngay_ks:new Date(2014,0,1),
	ngay_ky1:new Date(2014,0,1)
}
appModule.module.controller("initApp",["$scope","$window","$interval","$http",function($scope,$window,$interval,$http){
	$scope.changePicture = function(){
		var w = $window.open("#uploadfile/logos","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				var sp = w.document.title.split(".");
				$scope.data.logo =w.document.title + ".thumb." + sp[sp.length-1];
				w.close();
				$interval.cancel(interval);
			}
		},100);
		
	}
	$http.get("/public/province").success(function(province){
		$scope.province = province;
	});
	
}]);
appModule.init = function($scope,$controller){
	$controller("initApp",{$scope:$scope});
}
appModule.module.controller('baseAppHomeController',function($scope,$location,$cookieStore,$rootScope,app,$window){
	$scope.open = function(id,active){
		if(!active){
			var _confirm = confirm("Bạn phải kích hoạt công ty này trước khi làm việc.\nBạn có muốn kích hoạt ngay không?");
			if(_confirm){
				$scope.active(id);
			}
			return;
		}
		id_app = id;
		$rootScope.app_info = _.find($scope.list,function(r){
			return r._id==id;
		});
		$rootScope.id_app = id;
		$cookieStore.put("id_app",id);
		$location.path("/dashboard");
	}
	$scope.active = function(id){
		app.active(id).success(function(d){
			$window.location.reload();
		}).error(function(error){
			alert("Không thể kích hoạt");
		});
	}
});
appModule.initHomeController = function($controller,$scope){
	$controller("baseAppHomeController",{$scope:$scope});
}

var initAddEditController = function($controller,$scope){
	$scope.addParticipant = function($item){
		$scope.participant = undefined;
		if(!$scope.data.participants){
			$scope.data.participants = [];
		}
		var f = _.find($scope.data.participants,function(p){
			return (p.email == $item.email_coll);
		});
		if(f){
			alert($item.name + ' đã tồn tại');
			return;
		}
		$scope.data.participants.push({email:$item.email_coll,name:$item.name_coll,picture:$item.picture_coll,admin:false})
		
	}
	$scope.deleteParticipant = function(email){
		if(!$scope.data.participants){
			$scope.data.participants = [];
		}
		$scope.data.participants = _.reject($scope.data.participants,function(p){
			return p.email ==email;
		});
	}
}
appModule.initAddController = function($controller,$scope){
	initAddEditController($controller,$scope);
}
appModule.initEditController = function($controller,$scope){
	initAddEditController($controller,$scope);
}
appModule.module.controller("appsController",["$scope","$rootScope","$routeParams","$http","$cookies","user","$location",'$modal'
	,function($scope,$rootScope,$routeParams,$http,$cookies,user,$location,$modal){
		var email = $routeParams.email
		var url = "/api/app/apps/" + email
		$scope.email = email;
		$scope.openProfile = function(email){
			viewProfile($modal,email);
		}
		$http.get(url).success(function(apps){
			$scope.list = apps;
		});
	}
]);
appModule.module.controller("assignController",["$scope","$rootScope","$routeParams","$http","$cookies","user","$location","app"
	,function($scope,$rootScope,$routeParams,$http,$cookies,user,$location,app){
	checkIdApp("app",$cookies,user,$rootScope,$location,app,function(error,uerinfo,appinfo){
		if(error){
			return;
		}
		var id_app = $routeParams.id_app
		var email = $routeParams.email
		$scope.email = email;
		
		var query = {email:email}
		var url = "/api/" + id_app + "/right" + "?q=" + JSON.stringify(query)
		$http.get(url).success(function(result){
			console.log(result);
			var commands = $rootScope.commands
			commands.forEach(function(module){
				var groups = module.items;
				groups.forEach(function(group){
					var items = group.items;
					items.forEach(function(item){
						item.module = item.module?item.module:item.path
						var rs = _.find(result,function(r){
							return r.module == item.module;
						});
						if(rs){
							for(var k in rs){
								item[k] = rs[k];
							}
						}
						//
						item.id_app = id_app;
						item.email = email;
						
					});
					
				});
			})
			$scope.commands = commands;
			$scope.change = function(item,action){
				url = "/api/" + id_app + "/right"
				var rp
				if(item._id){
					url = url + "/" + item._id;
					rp = $http.put(url,item);
				}else{
					rp = $http.post(url,item);
				}
				
				rp.success(function(result){
					for(var k in result){
						item[k] = result[k];
					}
				}).error(function(error){
					console.log(item);
					alert(JSON.stringify(error));
				});
			}
		}).error(function(error){
			console.log(url);
		});
	});
	
	
	
}]);
appModule.module.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider
			.when("/assign/:id_app/:email",{
				templateUrl:"modules/lists/app/templates/assign.html",
				controller:"assignController"
			}).when("/apps/:email",{
				templateUrl:"modules/lists/app/templates/apps.html",
				controller:"appsController"
			});
}])