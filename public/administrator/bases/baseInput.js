/*Copyright (C) 2015  Sao Tien Phong (http://saotienphong.com.vn)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var viewProfile = function($modal,email){
	var modalInstance = $modal.open({
	  templateUrl: 'bases/templates/profile.html',
	  controller: ['$scope','$modalInstance','user','$location','$rootScope',function($scope,$modalInstance,user,$location,$rootScope){
			user.getProfile(email,function(error,profile){
				$scope.profile = profile;
			});
			$scope.cancel = function () {
				$modalInstance.dismiss('cancel');
			};;
			$scope.gotoChat = function(email){
				$modalInstance.dismiss('cancel');
				$location.path("/message/chat/" + email);
			}
			$scope.currentUser = $rootScope.user;
		}],
	  size: 'lg'
	});
}
var baseInput = function(code,server_path,fields_find,title,group,services){
	this.code = code;
	this.server_path = server_path;
	this.fields_find = fields_find;
	this.title = title;
	if(group){
		this.group = group;
	}else{
		this.group ="lists"
	}
	this.module = angular.module(code +"Module",['ngRoute']);
	var input = this;
	//config
	this.module.factory(code + 'Config',function(){
		return {
			title:title,
			path:code
		};
	});
	//service
	this.module.factory(code,function($http){
		var url_service = function(){
			var url;
			if(_.contains(paths_not_require_id_app,server_path)){
				
				url = "/api/" + server_path;
			}else{
				url = "/api/" + id_app + "/" + server_path;
			}
			return url;
		}
		return baseService($http,url_service,fields_find,services);
	});
	//controllers
	this.module.controller(code + "HomeController",['$controller','$scope','$http',code,'$location',code + 'Config','$cookies','$rootScope','user','app','$window','$interval','$modal',function($controller,$scope,$http,service,$location,config,$cookies,$rootScope,user,app,$window,$interval,$modal){
		$scope.condition ="";
		if(input.defaultConditions){
			$scope.condition ={};
			_.extend($scope.condition,input.defaultConditions);
		}
		if(input.loading){
			input.loading($scope);
		}
		angular.extend($scope,config);
		$scope.total_page = 1;
		$scope.current_page =1;
		$scope.pages =[1];
		$scope.limit = 50;
		$scope.$modal = $modal;
		var queryParams = $location.search();
		checkIdApp(code,$cookies,user,$rootScope,$location,app,function(error,uerinfo,appinfo){
			if(error){
				return;
			}
			$scope.current_user = $rootScope.user;
			
			$scope.goToPage = function(page){
				//get total pages
				service.load(id_app,{condition:$scope.condition,count:1,queryParams:queryParams})
					.success(function(data){
						$scope.total_page = Math.round(data.rows_number/$scope.limit,0);
						if($scope.total_page< data.rows_number/$scope.limit){
							$scope.total_page +=1;
						}
						if($scope.total_page==0){
							$scope.total_page=1;
						}
						$scope.pages=[];
						for(var i=1;i<= $scope.total_page;i++){
							$scope.pages.push(i);
						}
					});
				//load page
				service.load(id_app,{condition:$scope.condition,page:page,limit:$scope.limit,queryParams:queryParams})
					.success(function(data){
						config.list = data;
						config.id_app = id_app;
						config.current_page = page;
						config.condition = $scope.condition;
						$scope.current_page = page;
						$scope.list = data;
					});
			}
			
			if(!config.list || !config.list.length==0 || config.id_app != id_app){
				$scope.goToPage(1);
			}else{
				$scope.condition = config.condition;
				$scope.list = config.list;
				$scope.current_page = config.current_page;
				if(!$scope.current_page){
					$scope.current_page =1;
				}
				//get total pages
				service.load(id_app,{condition:$scope.condition,count:1,queryParams:queryParams})
				.success(function(data){
					$scope.total_page = Math.round(data.rows_number/$scope.limit,0);
					if($scope.total_page< data.rows_number/$scope.limit){
						$scope.total_page +=1;
					}
					if($scope.total_page==0){
						$scope.total_page=1;
					}
					$scope.pages=[];
					for(var i=1;i<= $scope.total_page;i++){
						$scope.pages.push(i);
					}
				});
					
				
			}
			$scope.update = function(data){
				service.update(id_app,data._id,data)
					.success(function(result){
						data.updated = true;
						alert('Đã cập nhật thành công');
					})
					.error(function(error){
						
						var msg =JSON.stringify(error);
						if(msg.indexOf("Lỗi")<0){
							if(msg.indexOf("duplicate")>=0){
								msg ="Lỗi: Đã tồn tại";
								return alert(msg);
							}else{
								if(msg.indexOf("Not allowed")>=0){
									msg ="Lỗi: Bạn không có quyền thực hiện thao tác này";
									return alert(msg);
								}
							}
							
						}
						msg = JSON.parse(msg);
						if(angular.isArray(msg)){
							alert(msg.join("\n"));
						}else{
							alert(msg);
						}
						
					});
			}
			$scope.add = function(){
				$location.path("/" + $scope.path + "/add");
			}
			$scope.edit = function(id){
				$location.path("/" + $scope.path + "/edit/" + id);
			}
			$scope.view = function(id){
				$location.path("/" + $scope.path + "/view/" + id);
			}
			$scope.searchKeyup = function(event){
				if(event.keyCode==13){
					$scope.search();
				}
			}
			$scope.search = function(){
				$scope.goToPage(1);
			}
			$scope.isUnSelected =function(){
				if(!$scope.list){
					return true;
				}
				for(var i=0;i<$scope.list.length;i++){
					var r = $scope.list[i];
					if(r.sel && r.sel==true){
						return false;
					}
				}
				return true;
			}
			$scope.delete = function(_id){
				if(_id){
					if(confirm("Có chắc chắn xóa không?")){
						service.delete(id_app,_id)
							.success(function(data){
								$scope.list = _.reject($scope.list,function(r){
									return(r._id ==_id);
								});
								config.list=$scope.list;
							})
							.error(function(error){
								var e;
								if(_.isObject(error)){
									e = JSON.stringify(error);
								}else{
									e = error;
								}
								
								if(e.indexOf("Lỗi:")>=0){
									alert(e)
								}else{
									alert("Không thể xóa");
								}
							});
					}
					
				}else{
					if(confirm("Có chắc chắn xóa những dòng đã chọn không?")){
						async.map($scope.list,function(r,callback){
							if(r.sel && r.sel==true){
								var id = r._id;
								service.delete(id_app,id)
									.success(function(data){
										$scope.list = _.reject($scope.list,function(r){
											return(r._id ==id);
										});
										callback(null,id);
									})
									.error(function(error){
										callback(error);
									});
							}else{
								callback();
							}
						},function(error,results){
							if(error){
								var e;
								if(_.isObject(error)){
									e = JSON.stringify(error);
								}else{
									e = error;
								}
								if(e.indexOf("Lỗi:")>=0){
									alert(e)
								}else{
									alert("Không thể xóa");
								}
							}else{
								config.list=$scope.list;
							}
						});
					}
				}
				
			}
			//init home controller
			if(input.initHomeController){
				input.initHomeController($controller,$scope,$http,service,$location,config);
			}
			if(input.init){
				input.init($scope,$controller);
			}
			//load RPTs
			var url_get_rpts = "/api/" + id_app + "/rpt?q={ma_cn:'" + code.toUpperCase()  + "'}"
			$http.get(url_get_rpts).success(function(rpts){
				$scope.rpts = rpts;
			}).error(function(e){
				console.log(e);
			})
			//print
			$scope.print = function(rpt_id){
				var url = "/api/"  + id_app + "/" + code + "/excel/" + rpt_id + "?access_token=" + eval("(" + $cookies.token + ")");
				$scope.list.forEach(function(r){
					if(r.sel){
						var url_c = url + "&_id=" + r._id;
						$window.open(url_c);
					}
				})
			}
			$scope.rptManagement = function(){
				var url = "/#/rpt?ma_cn=" + code.toUpperCase();
				$window.open(url);
			}
			$scope.import = function(){
				var w = $window.open("#"+code+"/import","Import","width=800,height=500");
			}
			$scope.options = function(){
				token = eval("(" + $cookies.token + ")")
				var modalInstance = $modal.open({
				  templateUrl: 'modules/' + group + "/" + code + '/templates/options.html',
				  controller:  ['$scope','$controller','$http', '$modalInstance','$window',function($scope,$controller,$http, $modalInstance,$window){
						var url = "/api/" + id_app + "/options";
						var options={}
						$http.get(url + "?access_token=" + token +  "&q={id_func:'" + code + "'}").success(function(opt){
							if(opt.length==1){
								options = opt[0]
								$scope.options = options.option;
							
							}else{
								options.id_app = id_app
								options.id_func = code
							}
							
						}).error(function(e){
							console.log(url)
						})
						$scope.save = function(){
							options.option = $scope.options
							
							if(!options._id){
								$http.post(url + "?access_token=" + token,options).success(function(d){
									$modalInstance.close();
								}).error(function(e){
									alert("Không thể lưu tùy chọn\n" + e.toString())
								})
							}else{
								$http.put(url + "/" + options._id + "?access_token=" + token,options).success(function(d){
									$modalInstance.close();
								}).error(function(e){
									alert("Không thể cập nhật tùy chọn\n" + e.toString())
								})
							}
							
						}
						
						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						}
					}],
				  size: "lg",
				  resolve: {
					/*parentScope: function () {
					  return $scope;
					}
					*/
				  }
				});
			}
		});
	}]);
	this.module.controller(code + "PrintController",['appInfo','$controller','$scope','$http',code,'$location',code + 'Config','$timeout','$cookies','$rootScope','user','app',function(appInfo,$controller,$scope,$http,service,$location,config,$timeout,$cookies,$rootScope,user,app){
		checkIdApp(code,$cookies,user,$rootScope,$location,app,function(error,userinfo,appinfo){
			if(error) return;
			$scope.current_user = $rootScope.user;
			$scope.parameters ={};
			$scope.title = title;
			appInfo.get(id_app,function(error,info){
				$scope.appInfo = info;
			});
			if(input.initPrintController){
				input.initPrintController($controller,$scope,$http,service,$location,config);
			}
			if(input.setDataSource2Print){
				input.setDataSource2Print($scope,service,config);
			}
			$scope.print = function(){
				$rootScope.printing = true;
				$scope.printing = true;
				$timeout(function(){
					window.print();
					$scope.printing = false;
					$rootScope.printing = false;
				},100);
				
			}
			if(input.setParameters){
				input.setParameters($scope,$controller);
			}
			$scope.back = function(){
				$location.url("/" + code);
			}
		});
		
	}]);
	this.module.directive(code + "Form",[function(){
		return {
			restrict:'E',
			templateUrl:"modules/" + input.group + "/" + code + "/templates/form.html"
		};
	}]);
	this.module.controller(code + 'ImportController',['$scope','user','$cookies','$rootScope','$location','app','$window','$routeParams',function($scope,user,$cookies,$rootScope,$location,app,$window,$routeParams){
		$scope.action = "/api/" + eval("(" + $cookies.id_app + ")") + "/" + input.server_path + "/import/excel?access_token=" + eval("(" + $cookies.token + ")");
		$scope.template = "modules/templates/" + input.code + ".xlsx"
	}]);
	this.module.controller(code + "AddController",['$controller','$scope','$http',code,'$location',code + 'Config','$cookies','$rootScope','user','app','$modal','$window',function($controller,$scope,$http,service,$location,config,$cookies,$rootScope,user,app,$modal,$window){
		$scope.masterData = {status:true};
		$scope.data = {status:true};
		$scope.$modal = $modal;
		$scope.$http = $http;
		$scope.$window = $window;
		if(input.defaultValues){
			_.extend($scope.data,input.defaultValues);
			_.extend($scope.masterData,input.defaultValues);
				
		}
		var paras = $location.search();
		if(paras){
			_.extend($scope.data,paras);
			_.extend($scope.masterData,paras);
		}
		if(input.init){
			input.init($scope,$controller);
		}
		$scope.action="Mới";
		checkIdApp(code,$cookies,user,$rootScope,$location,app,function(error,userinfo,appinfo){
			if(!error){
				$scope.current_user = $rootScope.user;
				$scope.isDataLoaded = true;
				angular.extend($scope,config);
				$scope.reset = function(){
					$scope.data=angular.copy($scope.masterData);
				}
				$scope.cancel=function(){
					$location.path("/" + $scope.path);
				}
				$scope.isUnchanged = function(){
					return angular.equals($scope.data,$scope.masterData);
				}
				$scope.create = function(){
					service.create(id_app,$scope.data)
						.success(function(data){
							$scope.masterData=data;
							if(!config.list){
								config.list =[];
							}
							config.list.push($scope.masterData);
							$location.path("/" + $scope.path);
							$window.scrollTo(0, 0);
						})
						.error(function(error){
							var msg =error;
							if(msg.indexOf("Lỗi")<0){
								if(msg.indexOf("duplicate")>=0){
									msg ="Lỗi: Đã tồn tại";
								}else{
									if(msg.indexOf("Not allowed")>=0){
										msg ="Lỗi: Bạn không có quyền thực hiện thao tác này";
									}
								}
							}
							
							if(angular.isArray(msg)){
								alert(msg.join("\n"));
							}else{
								alert(msg);
							}
							
						});
				}
				//init add controller
				if(input.initAddController){
					input.initAddController($controller,$scope,$http,service,$location,config);
				}
			}
		});
		
		
	}])
	this.quickadd = function($modal,fn,defaultvalues){
		var modalInstance = $modal.open({
		  templateUrl: 'modules/' + input.group + "/" + code + '/templates/dialog-quickadd.html',
		  controller:  ['$scope','$controller','$http',code,'$location',code + 'Config', '$modalInstance','$window',function($scope,$controller,$http,service,$location,config, $modalInstance,$window){
				$scope.masterData = {status:true};
				$scope.data = {status:true};
				if(input.init){
					input.init($scope,$controller);
				}
				$scope.isDataLoaded = true;
				$scope.$modal = $modal;
				$scope.$http = $http;
				$scope.$window = $window;
				if(input.defaultValues){
					_.extend($scope.data,input.defaultValues);	
				}
				
				if(defaultvalues){
					for(var k in defaultvalues){
						$scope.data[k] = defaultvalues[k];
					}
				}
				
				var paras = $location.search();
				if(paras){
					_.extend($scope.data,paras);
					_.extend($scope.masterData,paras);
				}
		
				angular.extend($scope,config);
				
				if(input.initAddController){
					input.initAddController($controller,$scope,$http,service,$location,config);
				}
				$scope.isUnchanged = function(){
					return angular.equals($scope.data,$scope.masterData);
				}
				$scope.create = function(){
					service.create(id_app,$scope.data)
						.success(function(data){
							$scope.masterData=data;
							if(!config.list){
								config.list =[];
							}
							config.list.push($scope.masterData);
							if(fn){
								fn($scope.masterData);
							}
							$modalInstance.close();
						})
						.error(function(data){
							var msg =data;
							if(msg.indexOf("Lỗi")<0){
								if(msg.indexOf("duplicate")>=0){
									msg ="Lỗi: Đã tồn tại";
								}else{
									if(msg.indexOf("Not allowed")>=0){
										msg ="Lỗi: Bạn không có quyền thực hiện thao tác này";
									}
								}
							}
							if(angular.isArray(msg)){
								alert(msg.join("\n"));
							}else{
								alert(msg);
							}
							
						});
				}
				
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				}
			}],
		  size: "lg",
		  resolve: {
			/*parentScope: function () {
			  return $scope;
			}
			*/
		  }
		});
	}
	this.module.controller(code + "EditController",['$controller','$scope','$http',code,'$location','$routeParams',code + 'Config','$timeout','$cookies','$rootScope','user','app','$modal','$window',function($controller,$scope,$http,service,$location,$routeParams,config,$timeout,$cookies,$rootScope,user,app,$modal,$window){
		$scope.masterData = null;
		$scope.data = {};
		
		if(input.init){
			input.init($scope,$controller);
		}
		$scope.$modal = $modal;
		$scope.$http = $http;
		$scope.$window = $window;
		$scope.action="Sửa";
		angular.extend($scope,config);
		//check id app
		checkIdApp(code,$cookies,user,$rootScope,$location,app,function(error,userinfo,appinfo){
			if(!error){
				$scope.current_user = $rootScope.user;
				if(config.list){
					$scope.masterData = _.find(config.list,function(r){return r._id==$routeParams.id});
				}
				$scope.openProfile = function(email){
					viewProfile($modal,email);
				}
				if(!$scope.masterData){
					$scope.masterData ={};
					service.get(id_app,$routeParams.id)
					.success(function(data){
						$scope.masterData = data;
						$scope.data = angular.copy($scope.masterData);
						if(!config.list) config.list =[];
						config.list.push($scope.masterData);
						$timeout(function(){
							$scope.isDataLoaded = true;
						},100);
					})
					.error(function(data){
						if(data.indexOf("Lỗi")>=0){
							alert(data);
						}else{
							alert("Không thể tìm thấy đối tượng này");
						}
					});
				}else{
					$scope.data = angular.copy($scope.masterData);
					$timeout(function(){
						$scope.isDataLoaded = true;
					},100);
				}
				
				$scope.isUnchanged = function(){
					return angular.equals($scope.data,$scope.masterData);
				}
				$scope.reset = function(){
					$scope.data=angular.copy($scope.masterData);
				}
				$scope.cancel=function(){
					$location.path("/" + $scope.path);
				}
				$scope.create = function(){
					service.update(id_app,$routeParams.id,$scope.data)
						.success(function(data){
							for(var key in data){
								$scope.masterData[key] = data[key];
							}
							$location.path("/" + $scope.path);
							$window.scrollTo(0, 0);
						})
						.error(function(error){
							var msg =JSON.stringify(error);
							if(msg.indexOf("Lỗi")<0){
								if(msg.indexOf("duplicate")>=0){
									msg ="Lỗi: Đã tồn tại";
									return alert(msg);
								}else{
									if(msg.indexOf("Not allowed")>=0){
										msg ="Lỗi: Bạn không có quyền thực hiện thao tác này";
										return alert(msg);
									}
								}
								
							}
							msg = JSON.parse(msg);
							if(angular.isArray(msg)){
								alert(msg.join("\n"));
							}else{
								alert(msg);
							}
						});
				}
				//init add controller
				if(input.initEditController){
					input.initEditController($controller,$scope,$http,service,$location,$routeParams,config,$timeout);
				}
			}
		});
	}]);
	this.module.controller(code + 'ViewController',['$controller','$scope','$routeParams',code + 'Config',code,'app','$cookies','user','$rootScope','$location',function($controller,$scope,$routeParams,config,service,app,$cookies,user,$rootScope,$location){
		checkIdApp(code,$cookies,user,$rootScope,$location,app,function(error,userinfo,appinfo){
			if(!error){
				$scope.current_user = $rootScope.user;
				$scope.action="Xem";
				angular.extend($scope,config);
				service.get(id_app,$routeParams.id).success(function(dt){
					$scope.data = dt;
				});
				$scope.edit = function(){
					$location.url("/" + code + "/edit/" + $routeParams.id);
				}
			}
		});
		
	}]);
	
	//router
	this.module.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider
			.when("/" + code,{
				templateUrl:"modules/" + input.group + "/" + code + "/templates/list.html",
				controller:code + "HomeController"
			})
			.when("/"+code+"/print",{
				templateUrl:"modules/" + input.group + "/" + code + "/templates/print.html",
				controller:code + "PrintController"
			})
			.when("/"+code+"/add",{
				templateUrl:"modules/" + input.group + "/" + code + "/templates/edit.html",
				controller:code + "AddController"
			})
			.when("/"+code+"/import",{
				templateUrl:"bases/templates/import.html",
				controller:code + "ImportController"
			})
			.when("/"+ code +"/edit/:id",{
				templateUrl:"modules/" + input.group + "/" + code + "/templates/edit.html",
				controller:code + "EditController"
			})
			.when("/"+ code +"/view/:id",{
				templateUrl:"modules/" + input.group + "/" + code + "/templates/view.html",
				controller:code + "ViewController"
			});
		
	}]);
	//init module
	if(this.initModule){
		this.initModule(this.module);
	}
}