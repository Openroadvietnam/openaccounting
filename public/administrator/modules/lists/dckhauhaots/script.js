var dckhauhaotsModule = new baseInput('dckhauhaots','dckhauhaots',["so_the_ts"],'Điều chỉnh khấu hao tài sản');
dckhauhaotsModule.loading = function(scope){
	var c = (new Date()).getFullYear();
	scope.nams =[];
	for(var n = c-10;n<c+10;n++){
			scope.nams.push(n);
	}
	scope.condition = {
		nam:c,
		thang:(new Date()).getMonth() + 1
	}
}