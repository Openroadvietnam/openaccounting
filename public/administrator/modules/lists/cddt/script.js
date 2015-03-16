var cddtModule = new baseInput('cddt','cddt',["tk","ma_dvcs","ma_dt"],'Số dư đầu kỳ vụ việc');
cddtModule.init = function($scope){
	$scope.$watch('data.du_no00',function(newData){
		if($scope.isDataLoaded){
			$scope.data.du_co00=0;
			$scope.data.du_co_nt00=0;
		}
	});
	$scope.$watch('data.du_no_nt00',function(newData){
		if($scope.isDataLoaded){
			$scope.data.du_co00=0;
			$scope.data.du_co_nt00=0;
		}
	});
	
	$scope.$watch('data.du_co00',function(newdata){
		if($scope.isDataLoaded){
			$scope.data.du_no00=0;
			$scope.data.du_no_nt00=0;
		}
	});
	$scope.$watch('data.du_co_nt00',function(newdata){
		if($scope.isDataLoaded){
			$scope.data.du_no00=0;
			$scope.data.du_no_nt00=0;
		}
	});
}
cddtModule.defaultValues = {
	du_no00:0,du_co00:0,du_no_nt00:0,du_co_nt:0
};
