var rptdtbanletheongay = new baseRpt('dtbanletheongay','dtbanletheongay','Doanh thu bán lẻ theo ngày');
rptdtbanletheongay.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptdtbanletheongay.module.controller('initdtbanletheongay',['$scope','ctbanleConfig',function($scope,ctbanleConfig){
	$scope.ctbanleConfig = ctbanleConfig;
}]);
rptdtbanletheongay.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initdtbanletheongay',{$scope:$scope});
	$scope.drilldown = function(row){
		var d = new Date(row.ngay_ct);
		if(_.isDate(d)){
			if(!$scope.ctbanleConfig.condition){
				$scope.ctbanleConfig.condition ={};
			}
			$scope.ctbanleConfig.condition.tu_ngay = d;
			$scope.ctbanleConfig.condition.den_ngay = d;
			$scope.ctbanleConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.ctbanleConfig.isDrillDown = true;
			$location.path("/ctbanle");
		}
	}
}