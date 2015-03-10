var rptdtbanletheoquy = new baseRpt('dtbanletheoquy','dtbanletheoquy','Doanh thu bán lẻ theo quý');
rptdtbanletheoquy.defaultCondition = function(condition){
	var c = new Date();
	condition.nam = c.getFullYear();
}

rptdtbanletheoquy.module.controller('initdtbanletheoquy',['$scope','ctbanleConfig',function($scope,ctbanleConfig){
	$scope.ctbanleConfig = ctbanleConfig;
}]);
rptdtbanletheoquy.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initdtbanletheoquy',{$scope:$scope});
	
	var nams =[];
	var nam = (new Date()).getFullYear();
	for(var n=nam-10;n<nam+10;n++){
		nams.push(n)
	}
	$scope.nams = nams
	
	$scope.drilldown = function(row){
		var quy = Number(row.quy);
		if(quy > 0 && quy < 5){
			if(!$scope.ctbanleConfig.condition){
				$scope.ctbanleConfig.condition ={};
			}
			var den_thang = quy * 3;
			var tu_thang = den_thang-2;
			$scope.ctbanleConfig.condition.tu_ngay = new Date($scope.condition.nam,tu_thang-1,1);
			$scope.ctbanleConfig.condition.den_ngay =new Date($scope.condition.nam,den_thang,0);
			$scope.ctbanleConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.ctbanleConfig.isDrillDown = true;
			$location.path("/ctbanle");
		}
	}
}