var rptbkvatvao = new baseRpt('bkvatvao','bkvatvao','BẢNG KÊ HOÁ ĐƠN, CHỨNG TỪ HÀNG HOÁ, DỊCH VỤ MUA VÀO');
rptbkvatvao.init = function($scope){
	$scope.sorts = [{ma:'ngay_hd',text:'Ngày hóa đơn'},{ma:'ngay_ct',text:'Ngày chứng từ'}];
}
rptbkvatvao.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
	condition.sort ='ngay_hd';
}
rptbkvatvao.afterLoadData = function($scope,data){
	async.map(data,function(r,callback){
		if(r.bold==true){
			r.style ={'fontWeight':'bold'};
		}
		callback(null);
	},function(error,result){
		
	});
}
rptbkvatvao.setParameters = function($scope,$controller){
	$scope.tong_tien_nt =0;
	$scope.tong_thue_nt =0;
	$scope.data.forEach(function(r){
		if(r.t_tien_nt && r.sysorder==5){
			$scope.tong_tien_nt += r.t_tien_nt;
		}
		if(r.t_thue_nt && r.sysorder==5){
			$scope.tong_thue_nt += r.t_thue_nt;
		}
	});
}