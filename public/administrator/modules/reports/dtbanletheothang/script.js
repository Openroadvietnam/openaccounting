var rptdtbanletheothang = new baseRpt('dtbanletheothang','dtbanletheothang','Doanh thu bán lẻ theo tháng');
rptdtbanletheothang.defaultCondition = function(condition){
	var c = new Date();
	condition.nam = c.getFullYear();
}
rptdtbanletheothang.module.controller('initdtbanletheothang',['$scope','ctbanleConfig',function($scope,ctbanleConfig){
	$scope.ctbanleConfig = ctbanleConfig;
}]);
rptdtbanletheothang.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initdtbanletheothang',{$scope:$scope});
	
	var nams =[];
	var nam = (new Date()).getFullYear();
	for(var n=nam-10;n<nam+10;n++){
		nams.push(n)
	}
	$scope.nams = nams
	
	$scope.drilldown = function(row){
		var thang = Number(row.thang);
		if(thang >0 && thang <=12){
			if(!$scope.ctbanleConfig.condition){
				$scope.ctbanleConfig.condition ={};
			}
			$scope.ctbanleConfig.condition.tu_ngay = new Date($scope.condition.nam,thang-1,1);
			$scope.ctbanleConfig.condition.den_ngay =new Date($scope.condition.nam,thang,0);
			$scope.ctbanleConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.ctbanleConfig.isDrillDown = true;
			$location.path("/ctbanle");
		}
	}
}