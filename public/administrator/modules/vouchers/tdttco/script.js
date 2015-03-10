angular.module('tdttcoModule',[])
	.directive('ngTdttco',[function(){
	return {
		restrict:'E',
		scope:{
			ngData:'=',
			ngMasterData:'='
		},
		templateUrl:'modules/vouchers/tdttco/templates/table.html',
		controller:function($scope,$modal,dmkh,dmvat,$timeout,$http){
			$scope.status = {isOpened:false};
			$scope.isNotRowwSelected = function(dt){
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
			$scope.getInvoice = function(){
				if(!$scope.ngMasterData.ma_kh){
					return alert("Phải nhập một khách hàng trước khi lấy hóa đơn");
				}
				var url ="/api/" + id_app + "/getinvoice2pay?ma_kh=" + $scope.ngMasterData.ma_kh;
				$http.get(url).success(function(invoices){
					$scope.ngData = invoices;
					if($scope.ngData.length==0){
						alert("Không có hóa đơn nào cần chi cho khách hàng này");
					}
				}).error(function(error){
					alert("Không thể lấy được thông tin hóa đơn");
					console.log(error);
				});
			}
			$scope.addDetail = function(){
				if(!$scope.ngData){
					$scope.ngData = [];
				}
				var line =$scope.ngData.length;
				$scope.dt_master = null;
				$scope.dt_current ={line:line};
				if(!$scope.ngData){
					$scope.ngData =[];
				}
				
				$scope.openDetail('lg');
			}
			$scope.editDetail = function(line){
				$scope.dt_master = _.find($scope.ngData,function(r){return r.line==line});
				$scope.dt_current ={};
				_.extend($scope.dt_current,$scope.dt_master);
				$scope.openDetail('lg');
			}
			$scope.openDetail = function (size,template) {
				var modalInstance = $modal.open({
				  templateUrl: 'modules/vouchers/tdttco/templates/edit.html',
				  controller:  function($scope, $modalInstance,parentScope){
						$scope.ngData = parentScope.ngData;
						$scope.dt_master = parentScope.dt_master;
						$scope.dt_current = parentScope.dt_current;
						$scope.ngMasterData=parentScope.ngMasterData;
						$scope.status=parentScope.status;
						$scope.updateDetail = function (){
							if(!$scope.dt_master){
								$scope.dt_master  = {};
								$scope.ngData.push($scope.dt_master);
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
						$scope.status.isOpened = false;
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
				scope.$watch('dt_current.tien_nt',function(newData){
					if(scope.status.isOpened){
						scope.dt_current.tien = Math.round(scope.dt_current.tien_nt * scope.ngMasterData.ty_gia,0);
						if(scope.dt_current.ty_gia_hd!=0){
							if(scope.dt_current.ty_gia_hd!='VND'){
								scope.dt_current.thanh_toan_qd = Math.round(scope.dt_current.tien / scope.dt_current.ty_gia_hd,2);
							}
							
						}
					}
				});	
				scope.$watch('dt_current.tien',function(newData){
					if(scope.status.isOpened){
						if(scope.dt_current.ty_gia_hd!=0){
							if(scope.dt_current.ty_gia_hd!='VND'){
								scope.dt_current.thanh_toan_qd = Math.round(scope.dt_current.tien / scope.dt_current.ty_gia_hd,2);
							}
						}
					}
				});	
			}
	}
}]);