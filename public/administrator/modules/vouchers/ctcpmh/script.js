angular.module('ctcpmhModule',[])
	.directive('ngCtcpmh',[function(){
	return {
		restrict:'E',
		scope:{
			ngData:'=',
			ngMasterData:'=',
			allocate:'&'
		},
		templateUrl:'modules/vouchers/ctcpmh/templates/table.html',
		controller:function($scope,$modal,dmkh,dmvat,$timeout){
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
				  templateUrl: 'modules/vouchers/ctcpmh/templates/edit.html',
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
				scope.$watch('dt_current.tien_cp_nt',function(newData){
					if(scope.status.isOpened){
						scope.dt_current.tien_cp = scope.dt_current.tien_cp_nt * scope.ngMasterData.ty_gia;
					}
				});	
			}
	}
}]);