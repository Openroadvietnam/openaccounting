var rptThnxt = new baseRpt('thnxt','thnxt','Tổng hợp nhập xuất tồn');
rptThnxt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
	condition.ma_kho ='';
	condition.ma_vt ='';
}
rptThnxt.module.controller('initThnxt',['$scope','sctvtConfig',function($scope,sctvtConfig){
	$scope.sctvtConfig = sctvtConfig;
}]);
rptThnxt.init = function($scope,$http,$filter,$location,$config,$controller){
	$controller('initThnxt',{$scope:$scope});
	$scope.drilldown = function(row){
		if(row.ma_vt && row.ma_vt!=''){
			if(!$scope.sctvtConfig.condition){
				$scope.sctvtConfig.condition ={};
			}
			$scope.sctvtConfig.condition.ma_vt = row.ma_vt;
			$scope.sctvtConfig.condition.ten_vt = row.ten_vt;
			$scope.sctvtConfig.condition.ma_kho = $scope.condition.ma_kho;
			$scope.sctvtConfig.condition.tu_ngay = $scope.condition.tu_ngay;
			$scope.sctvtConfig.condition.den_ngay = $scope.condition.den_ngay;
			$scope.sctvtConfig.condition.ma_dvcs = $scope.condition.ma_dvcs;
			$scope.sctvtConfig.isDrillDown = true;
			$location.path("/sctvt");
			
		}
		
		
	}
}
