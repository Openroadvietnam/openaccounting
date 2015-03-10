var rptdtbanletheokh = new baseRpt('dtbanletheokh','dtbanletheokh','Doanh thu bán lẻ theo khách hàng');
rptdtbanletheokh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptdtbanletheokh.module.controller('initdtbanletheokh',['$scope','ctbanleConfig',function($scope,ctbanleConfig){
	$scope.ctbanleConfig = ctbanleConfig;
}]);
rptdtbanletheokh.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initdtbanletheokh',{$scope:$scope});
	$scope.drilldown = function(row){
		var ma_kh = row.ma_kh;
		if(ma_kh){
			if(!$scope.ctbanleConfig.condition){
				$scope.ctbanleConfig.condition ={};
			}
			$scope.ctbanleConfig.condition.ma_kh = ma_kh;
			$scope.ctbanleConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.ctbanleConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.ctbanleConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.ctbanleConfig.isDrillDown = true;
			$location.path("/ctbanle");
		}
	}
}