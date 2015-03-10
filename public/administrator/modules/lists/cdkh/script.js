var cdkhModule = new baseInput('cdkh','cdkh',["tk","ma_kh","ma_dvcs"],'Số dư đầu kỳ công nợ khách hàng');
cdkhModule.init = function($scope){
	$scope.$watch('data.du_no00',function(newdata){
		if($scope.isDataLoaded){
			$scope.data.du_no1 = $scope.data.du_no00;
			$scope.data.du_co00=0;
			$scope.data.du_co1=0;
		}
	});
	$scope.$watch('data.du_co00',function(newdata){
		if($scope.isDataLoaded){
			$scope.data.du_co1 = $scope.data.du_co00;
			$scope.data.du_no00=0;
			$scope.data.du_no1=0;
		}
	});
}
cdkhModule.defaultValues = {
	du_no00:0,du_no1:0,du_co00:0,du_co1:0
}
