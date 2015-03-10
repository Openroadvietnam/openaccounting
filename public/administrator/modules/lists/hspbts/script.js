var hspbtsModule = new baseInput('hspbts','hspbts',["so_the_ts","ma_bp"],'Khai báo hệ số phân bổ tài sản');

hspbtsModule.loading = function(scope){
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
hspbtsModule.defaultValues ={
	he_so:0,
	thang:(new Date()).getMonth() +1,
	nam:(new Date()).getFullYear()
}
hspbtsModule.init = function(scope){
	scope.thangs =[1,2,3,4,5,6,7,8,9,10,11,12];
	scope.nams =[];
	var c = new Date();
	for(var t=c.getFullYear()-10;t<c.getFullYear()+10;t++){
		scope.nams.push(t);
	}
}