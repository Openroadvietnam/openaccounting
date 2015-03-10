var rptBkct = new baseRpt('bkct','bkct','Bảng kê chứng từ');
rptBkct.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptBkct.useExcelTemplate = true;