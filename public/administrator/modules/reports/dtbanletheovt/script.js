var rptdtbanletheovt = new baseRpt('dtbanletheovt','dtbanletheovt','Doanh thu bán lẻ theo sản phẩm');
rptdtbanletheovt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptdtbanletheovt.module.controller('initdtbanletheovt',['$scope','ctbanleConfig',function($scope,ctbanleConfig){
	$scope.ctbanleConfig = ctbanleConfig;
}]);
rptdtbanletheovt.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initdtbanletheovt',{$scope:$scope});
	$scope.drilldown = function(row){
		var ma_vt = row.ma_vt;
		if(ma_vt){
			if(!$scope.ctbanleConfig.condition){
				$scope.ctbanleConfig.condition ={};
			}
			$scope.ctbanleConfig.condition.ma_vt = ma_vt;
			$scope.ctbanleConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.ctbanleConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.ctbanleConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.ctbanleConfig.isDrillDown = true;
			$location.path("/ctbanle");
		}
	}
}