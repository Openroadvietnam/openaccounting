var rptdtbanletheonam = new baseRpt('dtbanletheonam','dtbanletheonam','Doanh thu bán lẻ theo năm');
rptdtbanletheonam.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_nam = c.getFullYear()-1;
	condition.den_nam = c.getFullYear();
}
rptdtbanletheonam.module.controller('initdtbanletheonam',['$scope','ctbanleConfig',function($scope,ctbanleConfig){
	$scope.ctbanleConfig = ctbanleConfig;
}]);
rptdtbanletheonam.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initdtbanletheonam',{$scope:$scope});
	
	var nams =[];
	var nam = (new Date()).getFullYear();
	for(var n=nam-10;n<nam+10;n++){
		nams.push(n)
	}
	$scope.nams = nams
	
	$scope.drilldown = function(row){
		var nam = Number(row.nam);
		if(nam>= $scope.condition.tu_nam && nam<=$scope.condition.den_nam){
			if(!$scope.ctbanleConfig.condition){
				$scope.ctbanleConfig.condition ={};
			}
			$scope.ctbanleConfig.condition.tu_ngay = new Date(nam,0,1);
			$scope.ctbanleConfig.condition.den_ngay =new Date(nam,12,0);
			$scope.ctbanleConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.ctbanleConfig.isDrillDown = true;
			$location.path("/ctbanle");
		}
	}
}