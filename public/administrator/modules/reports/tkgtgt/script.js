var rpttkgtgt = new baseRpt('tkgtgt','tkgtgt','Tờ khai thuế GTGT');
rpttkgtgt.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_thang = c.getMonth()+1;
	condition.den_thang = c.getMonth()+1;
	condition.nam = c.getFullYear();
}