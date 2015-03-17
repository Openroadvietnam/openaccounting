var rptcdpskh = new baseRpt('cdpskh','cdpskh','Cân đối phát sinh theo khách hàng');
rptcdpskh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptcdpskh.module.controller('initCdkh',['$scope','sctcnkhConfig',function($scope,sctcnkhConfig){
	$scope.sctcnkhConfig = sctcnkhConfig;
}]);
rptcdpskh.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initCdkh',{$scope:$scope});
	$scope.drilldown = function(row){
		if(row.ma_kh){
			if(!$scope.sctcnkhConfig.condition){
				$scope.sctcnkhConfig.condition ={};
			}
			$scope.sctcnkhConfig.condition.tk = $scope.condition.tk;
			$scope.sctcnkhConfig.condition.ten_tk = $scope.condition.ten_tk;
			$scope.sctcnkhConfig.condition.ma_kh = row.ma_kh;
			$scope.sctcnkhConfig.condition.ten_kh = row.ten_kh;
			$scope.sctcnkhConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.sctcnkhConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.sctcnkhConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.sctcnkhConfig.isDrillDown = true;
			$location.path("/sctcnkh");
			
		}
		
		
	}
}
rptcdpskh.useExcelTemplate = true;
