var rpttinhkhauhaots = new baseRpt('tinhkhauhaots','tinhkhauhaots','Tính khấu hao tài sản');
rpttinhkhauhaots.init = function($scope){
	$scope.thangs =[1,2,3,4,5,6,7,8,9,10,11,12];
	$scope.nams =[];
	for(var nam =(new Date).getFullYear() - 10;nam < (new Date).getFullYear() + 10;nam++){
		$scope.nams.push(nam);
	}
}
rpttinhkhauhaots.defaultCondition = function(condition){
	var c = new Date();
	condition.nam = c.getFullYear();
	condition.thang = c.getMonth()+1;
	condition.tinh_kh_theo_ngay = true;
}