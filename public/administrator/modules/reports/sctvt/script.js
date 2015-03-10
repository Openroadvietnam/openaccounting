var rptsctvt = new baseRpt('sctvt','sctvt','Sổ chi tiết vật tư');
rptsctvt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptsctvt.afterLoadData = function($scope,data){
	$scope.title = 'Sổ chi tiết vật tư: ' + $scope.condition.ma_vt + " - " + $scope.condition.ten_vt;
}