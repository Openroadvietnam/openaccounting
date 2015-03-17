var rptCdpstk = new baseRpt('cdpstk','cdpstk','Cân đối phát sinh tài khoản');
rptCdpstk.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptCdpstk.module.controller('initCdpstk',['$scope','scttkConfig',function($scope,scttkConfig){
	$scope.scttkConfig = scttkConfig;
}]);
rptCdpstk.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initCdpstk',{$scope:$scope});
	$scope.drilldown = function(row){
		if(row.tk && row.tk!=''){
			if(!$scope.scttkConfig.condition){
				$scope.scttkConfig.condition ={};
			}
			$scope.scttkConfig.condition.tk = row.tk;
			$scope.scttkConfig.condition.ten_tk = row.ten_tk;
			$scope.scttkConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.scttkConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.scttkConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.scttkConfig.isDrillDown = true;
			$location.path("/scttk");
			
		}
		
		
	}
}
rptCdpstk.useExcelTemplate = true;
