var rpttinhgiatb = new baseRpt('tinhgiatb','tinhgiatb','Tính giá trung bình');
rpttinhgiatb.init = function($scope){
	$scope.thangs =[1,2,3,4,5,6,7,8,9,10,11,12];
	$scope.nams =[];
	for(var nam =(new Date).getFullYear() - 10;nam < (new Date).getFullYear() + 10;nam++){
		$scope.nams.push(nam);
	}
}
rpttinhgiatb.defaultCondition = function(condition){
	var c = new Date();
	condition.nam = c.getFullYear();
	condition.tu_thang = c.getMonth()+1;
	condition.den_thang = c.getMonth()+1;
}