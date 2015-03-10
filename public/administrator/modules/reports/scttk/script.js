var rptScttk = new baseRpt('scttk','scttk','Sổ chi tiết tài khoản');
rptScttk.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
}
rptScttk.afterLoadData = function($scope,data){
	$scope.title = 'Sổ cái tài khoản: ' + $scope.condition.tk + " - " + $scope.condition.ten_tk;
}
rptScttk.exportConfig ={
	title:'SỔ CHI TIẾT TÀI KHOẢN',
	conditions:[
		{name:'tu_ngay',caption:'Từ ngày'},
		{name:'den_ngay',caption:'Đến ngày'},
		{name:'tk',caption:'Tài khoản'},
		{name:'ten_tk',caption:'Tên tài khoản'},
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