var rptModule = new baseInput('rpt','rpt',["ma_cn","ten_mau_in"],'Quản lý mẫu in');

rptModule.module.controller("initrpt",["$scope","$window","$interval",function($scope,$window,$interval){
	$scope.changeFile = function(){
		var w = $window.open("#uploadexcel","Upload file","width=600,height=300");
		var interval = $interval(function(){
			if(w.document.body.innerHTML=="success"){
				$scope.data.file_mau_in = w.document.title;
				w.close();
				$interval.cancel(interval);
			}
		},100);
	}
}]);
rptModule.init = function($scope,$controller){
	$controller("initrpt",{$scope:$scope});
}
