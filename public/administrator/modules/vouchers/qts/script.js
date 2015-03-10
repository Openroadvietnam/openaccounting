var qtsModule = new baseVoucher('qts','qts',['so_the_ts','ten_ts'],'Khai báo tài sản cố định');
qtsModule.module.defaultValues ={
	so_ky_kh:0,lam_tron_kh:0,ngay_tang:new Date()
	,pp_tinh_kh:'1',ma_gd:'1'
}
qtsModule.defaultValues4Detail = {
	nguyen_gia:0,
	gia_tri_da_kh:0,gia_tri_con_lai:0,
	gia_tri_kh_ky:0,tinh_kh_gia_tri_con_lai:true
}
qtsModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',ten_ts:'',so_the_ts:''};
qtsModule.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		so_the_ts:{$regex:$scope.vcondition.so_the_ts,$options:'i'},
		ten_ts:{$regex:$scope.vcondition.ten_ts,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}
	
qtsModule.watchDetail = function(scope){
	scope.$watch("dt_current.nguyen_gia",function(newValue,oldValue){
		if(newValue && newValue!=oldValue){
			scope.dt_current.gia_tri_con_lai = scope.dt_current.nguyen_gia -scope.dt_current.gia_tri_da_kh; 
			if(!scope.ngMasterData.tinh_kh_gia_tri_con_lai){
				scope.dt_current.gia_tri_kh_ky = Math.round(scope.dt_current.nguyen_gia/scope.ngMasterData.so_ky_kh,0); 
			}
		}
		
	});
	scope.$watch("dt_current.gia_tri_da_kh",function(newValue,oldValue){
		if(newValue && newValue!=oldValue){
			scope.dt_current.gia_tri_con_lai = scope.dt_current.nguyen_gia -scope.dt_current.gia_tri_da_kh; 
		}
	});
	scope.$watch("dt_current.gia_tri_con_lai",function(newValue,oldValue){
		if(newValue && newValue!=oldValue && scope.ngMasterData.so_ky_kh!=0 && scope.ngMasterData.tinh_kh_gia_tri_con_lai){
			scope.dt_current.gia_tri_kh_ky = Math.round(scope.dt_current.gia_tri_con_lai/scope.ngMasterData.so_ky_kh,0); 
		}
	});
}
qtsModule.watchMaster = function(scope){
	scope.$watch("data.tinh_kh_gia_tri_con_lai",function(newValue){
		if(newValue){
			scope.data.details.forEach(function(dt_current){
				if(scope.data.so_ky_kh!=0){
					dt_current.gia_tri_kh_ky = Math.round(dt_current.gia_tri_con_lai/scope.data.so_ky_kh,0); 
				}
			});
		}else{
			scope.data.details.forEach(function(dt_current){
				if(scope.data.so_ky_kh!=0){
					dt_current.gia_tri_kh_ky = Math.round(dt_current.nguyen_gia/scope.data.so_ky_kh,0); 
				}
			});
		}
	});
	scope.$watch("data.so_ky_kh",function(newValue){
		if(!newValue) return;
		if(scope.data.tinh_kh_gia_tri_con_lai){
			scope.data.details.forEach(function(dt_current){
				if(scope.data.so_ky_kh!=0){
					dt_current.gia_tri_kh_ky = Math.round(dt_current.gia_tri_con_lai/scope.data.so_ky_kh,0); 
				}
			});
		}else{
			scope.data.details.forEach(function(dt_current){
				if(scope.data.so_ky_kh!=0){
					dt_current.gia_tri_kh_ky = Math.round(dt_current.nguyen_gia/scope.data.so_ky_kh,0); 
				}
			});
		}
	});
}

qtsModule.module.setDataSource2Print = function($scope,service,config){
}