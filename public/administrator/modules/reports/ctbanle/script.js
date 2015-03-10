var rptctbanle = new baseRpt('ctbanle','ctbanle','Chi tiết bán lẻ');
rptctbanle.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(Date.UTC(c.getFullYear(),c.getMonth(),1));
	condition.den_ngay = c;
}