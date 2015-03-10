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
var dateTime2Date = function(dateTime){
	return  new Date(Date.UTC(dateTime.getFullYear(),dateTime.getMonth(),dateTime.getDate()));
}
var baseVoucher = function(voucherId,server_path,fields_find,title){
	this.voucherId = voucherId;
	this.module =  new baseInput(voucherId,server_path,fields_find,title,"vouchers");
	this.server_path = this.module.server_path;
	this.fields_find = this.module.fields_find;
	this.quickadd = this.module.quickadd;
	var voucher = this;
	this.module.module.controller(voucherId + "BaseHomeController",function($scope,$modal){
		$scope.find = function(){
			var modalInstance = $modal.open({
				  templateUrl: 'modules/vouchers/' + voucherId + '/templates/find.html',
				  controller:  function($scope,$modalInstance,parentScope){
						$scope.vcondition = {};
						if(voucher.defaultCondition4Search){
							$scope.vcondition = voucher.defaultCondition4Search;
						}
						$scope.list = parentScope.list;
						$scope.search = parentScope.search;
						$scope.okFind = function (){
							voucher.defaultCondition4Search = $scope.vcondition;
							if(voucher.prepareCondition4Search){
								parentScope.condition= voucher.prepareCondition4Search($scope,$scope.vcondition);
							}else{
								parentScope.condition={};
								_.extend(parentScope.condition,$scope.vcondition);
							}
							$scope.search();
							$modalInstance.close();
							
						};
						$scope.cancelFind = function () {
							$modalInstance.dismiss('cancel');
						};
					},
				  size: 'lg',
				  resolve: {
					parentScope: function () {
					  return $scope;
					}
				  }
				});
			}
		}
	);
	this.module.module.controller(voucherId + "BaseEditController",function($scope,$http,$modal){
		$scope.round =0;
		$scope.$watch('data.ma_nt',function(newData){
			if(newData && newData!='VND'){
				$scope.round =2;
			}
		});
		if(voucher.watchMaster){
			voucher.watchMaster($scope);
		}
		
	});
	
	this.module.module.controller(voucherId + "BaseAddController",function($scope,$http,$modal,dvcs){
		$scope.round =0;
		$scope.$watch('data.ma_nt',function(newData){
			if(newData && newData!='VND'){
				$scope.round =2;
			}
		});
		if(voucher.watchMaster){
			voucher.watchMaster($scope);
		}
		dvcs.list(id_app,{status:true},"_id",0,1,1).success(function(kq){
			if(kq.length>0){
				$scope.data.ma_dvcs=kq[0]._id;
			}
		});
	});
	
	this.module.initHomeController = function($controller,$scope,$http,service,$location,config){
		$controller(voucherId + "BaseHomeController",{$scope:$scope});
	}
	
	this.module.initAddController = function($controller,$scope,$http,service,$location,config){
		$controller( voucherId + "BaseAddController",{$scope:$scope});
		$scope.data.ty_gia=1;
		$scope.data.ma_nt='VND';
		$scope.data.ngay_ct =new Date();
		$scope.data.details =[];
		service.next(id_app,"so_ct").success(function(seq){
			$scope.data.so_ct = seq.so_ct;
		}).error(function(error){
			console.log(error);
		});
	}
	this.module.initEditController = function($controller,$scope,$http,service,$location,$routeParams,config,$timeout){
		$controller(voucherId + "BaseEditController",{$scope:$scope});
		if(!$scope.data.details) $scope.data.details =[];
	}
	this.module.module.directive(voucherId + "DetailTable",function(){
		return {
			restrict:'E',
			scope:{
				ngMasterData:'='
			},
			templateUrl:"modules/vouchers/" + voucherId + "/templates/detail-table.html",
			controller:function($scope,$modal,$timeout,$http,$window){
				$scope.status ={isOpened:false};
				$scope.$modal = $modal;
				$scope.$http = $http;
				$scope.$window = $window;
				$scope.isNotRowSelected = function(dt){
					return (_.filter(dt,function(r){return r.sel==true}).length==0);
				}
				$scope.deleteRow = function(dt){
					var rc = _.reject(dt,function(r){return r.sel==true});
					dt.length =0;
					var i=0;
					rc.forEach(function(r){
						r.line = i;
						dt.push(r)
						i++;
					});
				}
				//detail input
				$scope.addDetail = function(){
					var line =$scope.ngMasterData.details.length;
					$scope.dt_master = null;
					$scope.dt_current ={line:line};
					if(voucher.defaultValues4Detail){
						_.extend($scope.dt_current,voucher.defaultValues4Detail);
					}
					if(!$scope.ngMasterData.details){
						$scope.ngMasterData.details =[];
					}
					$scope.openDetail('lg');
				}
				$scope.editDetail = function(line){
					$scope.dt_master = _.find($scope.ngMasterData.details,function(r){return r.line==line});
					$scope.dt_current ={};
					_.extend($scope.dt_current,$scope.dt_master);
					$scope.openDetail('lg');
				}
						
				$scope.openDetail = function (size,template) {
					var modalInstance = $modal.open({
					  templateUrl: 'modules/vouchers/' + voucherId + '/templates/detail-edit.html',
					  controller:  function($scope, $modalInstance,parentScope){
							$scope.data = parentScope.ngMasterData;
							$scope.status = parentScope.status;
							
							$scope.dt_master = parentScope.dt_master;
							$scope.dt_current = parentScope.dt_current;
							$scope.updateDetail = function (){
								if(!$scope.dt_master){
									$scope.dt_master  = {};
									$scope.data.details.push($scope.dt_master);
								}
								for(var k in $scope.dt_current){
									$scope.dt_master[k] = $scope.dt_current[k];
								}
								$modalInstance.close();
								
							};
							$scope.cancelDetail = function () {
								$modalInstance.dismiss('cancel');
							};
						},
					  size: size,
					  resolve: {
						parentScope: function () {
						  return $scope;
						}
					  }
					});
					
					modalInstance.opened.then(function(){
						$timeout(function(){
							$scope.status.isOpened = true;
						},100);
						
					});
					modalInstance.result.then(function(result){
						$scope.status.isOpened = false;
					});

				}
			},
			link:function(scope,elem,attrs,ctr){
				if(voucher.watchDetail){
					voucher.watchDetail(scope);
				}
			}
		}
	});
}