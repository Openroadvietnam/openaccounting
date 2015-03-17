var rptsctdt = new baseRpt('sctdt','sctdt','Sổ chi tiết vụ việc');
rptsctdt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptsctdt.afterLoadData = function($scope,data){
	$scope.title = 'Sổ chi tiết vụ việc: ' + $scope.condition.ma_dt + ' - ' + $scope.condition.ten_dt;
}
rptsctdt.useExcelTemplate = true;