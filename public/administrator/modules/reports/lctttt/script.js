var rptlctttt = new baseRpt('lctttt','lctttt','Lưu chuyển tiền tệ phương pháp trực tiếp');
rptlctttt.defaultCondition = function(condition){
	var c = new Date();
	var y = c.getFullYear();
	var m = c.getMonth();
	var d = c.getDate();
	
	condition.tu_ngay = new Date(y,m,1);
	condition.den_ngay = c;
	condition.tu_ngay_kt = new Date(y-1,m,1);
	condition.den_ngay_kt = new Date(y-1,m,d);
}