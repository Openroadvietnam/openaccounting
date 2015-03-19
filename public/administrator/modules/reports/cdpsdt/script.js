var rptcdpsdt = new baseRpt('cdpsdt','cdpsdt','Cân đối phát sinh theo vụ việc');
rptcdpsdt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptcdpsdt.module.controller('initCddt',['$scope','sctdtConfig',function($scope,sctdtConfig){
	$scope.sctdtConfig = sctdtConfig;
}]);
rptcdpsdt.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initCddt',{$scope:$scope});
	$scope.drilldown = function(row){
		if(row.ma_dt){
			if(!$scope.sctdtConfig.condition){
				$scope.sctdtConfig.condition ={};
			}
			$scope.sctdtConfig.condition.tk = $scope.condition.tk;
			$scope.sctdtConfig.condition.ten_tk = $scope.condition.ten_tk;
			$scope.sctdtConfig.condition.ma_dt = row.ma_dt;
			$scope.sctdtConfig.condition.ten_dt = row.ten_dt;
			$scope.sctdtConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.sctdtConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.sctdtConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.sctdtConfig.isDrillDown = true;
			$location.path("/sctdt");
			
		}
		
		
	}
}
rptcdpsdt.useExcelTemplate = true;
