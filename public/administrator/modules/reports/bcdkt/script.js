var rptBkct = new baseRpt('bcdkt','bcdkt','Bảng cân đối kế toán');
rptBkct.defaultCondition = function(condition){
	var c = new Date();
	condition.den_ngay = c;
}