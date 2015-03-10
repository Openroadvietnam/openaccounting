var rptsctcnkh = new baseRpt('sctcnkh','sctcnkh','Sổ chi tiết công nợ khách hàng');
rptsctcnkh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptsctcnkh.afterLoadData = function($scope,data){
	$scope.title = 'Sổ chi tiết công nợ khách hàng: ' + $scope.condition.ma_kh + ' - ' + $scope.condition.ten_kh;
}
rptsctcnkh.exportConfig ={
	title:'Sổ chi tiết công nợ khách hàng',
	conditions:[
		{name:'tu_ngay',caption:'Từ ngày'},
		{name:'den_ngay',caption:'Đến ngày'},
		{name:'tk',caption:'Tài khoản'},
		{name:'ten_tk',caption:'Tên tài khoản'},
		{name:'ma_kh',caption:'Mã khách'},
		{name:'ten_kh',caption:'Tên khách hàng'},
		{name:'ten_dvcs',caption:'Đơn vị cơ sở'}
	],
	columns:[
		{name:'so_ct',caption:'Số chứng từ',type:'string',width:15},
		{name:'ngay_ct',caption:'Ngày chứng từ',type:'date',width:15},
		{name:'dien_giai',caption:'Diễn giải',type:'string',width:30},
		{name:'tk_du',caption:'TK đối ứng',type:'string',width:15},
		{name:'ps_no',caption:'PS nợ',type:'number',width:15},
		{name:'ps_co',caption:'PS có',type:'number',width:15}
	]
}