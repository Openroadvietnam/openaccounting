var rptsctcnkh = new baseRpt('sctcnkh','sctcnkh','Sổ chi tiết công nợ khách hàng');
rptsctcnkh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptsctcnkh.afterLoadData = function($scope,data){
	$scope.title = 'Sổ chi tiết công nợ khách hàng: ' + $scope.condition.ma_kh + ' - ' + $scope.condition.ten_kh;
}
rptsctcnkh.useExcelTemplate = true;