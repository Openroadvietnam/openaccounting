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
var getData = function($http,$filter,url,condition,callback){
	if(condition){
		angular.forEach(condition,function(v,k){
			if(angular.isDate(v)){
				//v = new Date(Date.UTC(v.getFullYear(),v.getMonth(),v.getDate()))
				//v = $filter('date')(v,'yyyy-MM-dd');
				v = v.toUTCString();
			}else{
				if(angular.isObject(v)){
					v = JSON.stringify(v);
				}
			}
			url =url + "&" + k  + '=' + v;
		});
	}
	$http.get(url)
		.success(function(data){
			callback(null,data);
		})
		.error(function(error){
			console.log(error);
			callback(error);
		});
}
var baseRpt = function(rptId,path_service,title){
	this.rptId = rptId;
	this.rptModuleName = rptId + 'Module';
	this.module = angular.module(this.rptModuleName,['ngRoute']);
	var rpt =  this;
	this.module.factory(rptId +'Config',function(){
		return {};
	});
	this.module.controller(rptId +'Controller',['$scope','$http','$filter','$location',rptId +'Config','$controller','$cookies','$rootScope','user','app','$window',function($scope,$http,$filter,$location,$config,$controller,$cookies,$rootScope,user,app,$window){
		if(checkIdApp(rptId,$cookies,user,$rootScope,$location,app)==false){
			return;
		}
		$scope.condition = $config.condition;
		$scope.title = title;
		if($config.id_app == id_app){
			$scope.data = $config.data;
		}
		if($scope.data){
			$scope.condition_show = false;
			if(rpt.afterLoadData){
				rpt.afterLoadData($scope,$scope.data);
			}
		}else{
			$scope.condition_show = true;
		}
		if(!$scope.condition && rpt.defaultCondition){
			$scope.condition = {};
			rpt.defaultCondition($scope.condition);
		}
		var url = "/api/" + id_app + "/" + path_service + "?t=1";
		$scope.hideCondition = function(){
			$scope.condition_show = !$scope.condition_show;
		}
		$scope.viewVoucher = function(ma_ct,id_ct){
			if(ma_ct && id_ct){
				var url = "#/" +  ma_ct.toLowerCase() +  "/edit/" + id_ct
				$window.open(url,"","width=" + $window.innerWidth.toString() + ",height=500");
			}
			
		}
		$scope.getData = function(){
			if(rpt.prepareCondition){
				rpt.prepareCondition($scope.condition,$filter,function(error,condition){
					if(error){
						$scope.error = error;
					}else{
						getData($http,$filter,url,condition,function(error,data){
							$scope.data = data;
							$scope.error = error;
							if(!error){
								$scope.condition_show = false;
								$config.condition = $scope.condition;
								$config.data = data;
								$config.id_app = id_app;
								if(rpt.afterLoadData){
									rpt.afterLoadData($scope,data);
								}
							}
						});
					}
					
				})
			}else{
				getData($http,$filter,url,$scope.condition,function(error,data){
					$scope.data = data;
					$scope.error = error;
					if(!error){
						$scope.condition_show = false;
						$config.condition = $scope.condition;
						$config.data = data;
						$config.id_app = id_app;
						if(rpt.afterLoadData){
							rpt.afterLoadData($scope,data);
						}
					}
				});
			}
		}
		$scope.print = function(){
			$location.path("/" + rptId +"/print");
		}
		$scope.exportExcel = function (conf) {
			if(!rpt.useExcelTemplate){
				export_table_to_excel('exportable',title);
			}else{
				var url ="/api/" + id_app + "/" + path_service + "/excel?access_token=" + access_token
				if(rpt.prepareCondition){
					rpt.prepareCondition($scope.condition,$filter,function(error,condition){
						if(error){
							$scope.error = error;
						}else{
							angular.forEach(condition,function(v,k){
								if(angular.isDate(v)){
									v = $filter('date')(v,'yyyy-MM-dd');
								}
								if(angular.isObject(v)){
									v = JSON.stringify(v);
								}
								url =url + "&" + k  + '=' + v;
							});
							$window.open(url);
						}
						
					})
				}else{
					angular.forEach($scope.condition,function(v,k){
						if(angular.isDate(v)){
							v = $filter('date')(v,'yyyy-MM-dd');
						}
						if(angular.isObject(v)){
							v = JSON.stringify(v);
						}
						url =url + "&" + k  + '=' + v;
					});
					$window.open(url);
				}
			}
			
			
			
			
		}
		if(rpt.init){
			rpt.init($scope,$http,$filter,$location,$config,$controller);
		}
		if($config.isDrillDown==true){
			$config.isDrillDown = false;
			$scope.getData();
		}
	}]);
	this.module.controller(rptId +'PrintController',['$controller','appInfo','$scope',rptId +'Config','$timeout','$cookies','$location','$rootScope','user','app',function($controller,appInfo,$scope,$config,$timeout,$cookies,$location,$rootScope,user,app){
		if(checkIdApp(rptId,$cookies,user,$rootScope,$location,app)==false){
			return;
		}
		$scope.parameters ={};
		$scope.condition = $config.condition;
		$scope.title = title;
		$scope.data = $config.data;
		appInfo.get(id_app,function(error,data){
			$scope.appInfo = data;
		});
		if(rpt.setParameters){
			rpt.setParameters($scope,$controller);
		}
		$scope.print = function(){
			$scope.printing = true;
			$rootScope.printing = true;
			$timeout(function(){
				window.print();
				$scope.printing = false;
				$rootScope.printing = false;
			},100);
			
		}
		$scope.back = function(){
			$location.url("/" + rptId);
		}
	}]);
	
	this.module.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
		$routeProvider
			.when("/" + rptId,{
				templateUrl:"modules/reports/" + rptId + "/templates/browser.html",
				controller:rptId + "Controller"
			})
			.when("/" + rptId +"/print",{
				templateUrl:"modules/reports/" + rptId + "/templates/print.html",
				controller:rptId + "PrintController"
			})
		
	}]);
}