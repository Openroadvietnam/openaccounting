var pn1Module = new baseVoucher('pn1','pn1',[],'Phiếu nhập mua hàng trong nước');
pn1Module.module.defaultValues ={
	vatvaos:[],
	tk_co:'1111',
	ten_tk_co:'Tiền mặt'
}
pn1Module.defaultValues4Detail = {
	sl_nhap:0,
	ty_le_ck:0,
	gia_von_nt:0,gia_von:0,
	tien_hang_nt:0,tien_hang:0,
	tien_ck_nt:0,tien_ck:0,
	tien_phi_nt:0,tien_phi:0,
	tien_nhap_nt:0,tien_nhap:0
}
pn1Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pn1Module.prepareCondition4Search = function($scope,vcondition){
	return {
		so_ct:{$regex:$scope.vcondition.so_ct,$options:'i'},
		dien_giai:{$regex:$scope.vcondition.dien_giai,$options:'i'},
		ma_kh:{$regex:$scope.vcondition.ma_kh,$options:'i'},
		ngay_ct:{
			$gte:dateTime2Date($scope.vcondition.tu_ngay),
			$lte:dateTime2Date($scope.vcondition.den_ngay)
		}
	};
}	
pn1Module.watchDetail = function(scope){
	scope.$watch('dt_current.sl_nhap',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang_nt = Math.round( scope.dt_current.sl_nhap * scope.dt_current.gia_von_nt,scope.round);
		}
	});
	
	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von = Math.round(scope.dt_current.gia_von_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_hang_nt = Math.round(scope.dt_current.gia_von_nt * scope.dt_current.sl_nhap,scope.round);
		}
	});
	scope.$watch('dt_current.gia_von',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang = Math.round(scope.dt_current.gia_von * scope.dt_current.sl_nhap,scope.round);
		}
	});
	
	scope.$watch('dt_current.tien_hang_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang = Math.round(scope.dt_current.tien_hang_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_nhap_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt + scope.dt_current.tien_phi_nt;
		}
	});
	scope.$watch('dt_current.tien_hang',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_hang * scope.dt_current.ty_le_ck/100,0);
			scope.dt_current.tien_nhap = scope.dt_current.tien_hang - scope.dt_current.tien_ck + scope.dt_current.tien_phi;
		}
	});
	
	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.round);
		}
	});
	
	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_nhap_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt + scope.dt_current.tien_phi_nt;
		}
	});
	
	scope.$watch('dt_current.tien_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = scope.dt_current.tien_hang - scope.dt_current.tien_ck + scope.dt_current.tien_phi;
		}
	});
	scope.$watch('dt_current.tien_phi_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_phi = Math.round(scope.dt_current.tien_phi_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_nhap_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt + scope.dt_current.tien_phi_nt;
		}
	});
	
	scope.$watch('dt_current.tien_phi',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_nhap = scope.dt_current.tien_hang - scope.dt_current.tien_ck + scope.dt_current.tien_phi;
		}
	});
}
pn1Module.watchMaster = function(scope){
	//phan bo chi phi
	scope.allocate = function(allocate_by_field){
		var t_cp_nt = scope.data.t_cp_cpb_nt;
		var t_cp = scope.data.t_cp_cpb;
		
		//
		var mau =0;
		for(var i=0;i<scope.data.details.length;i++){
			mau = mau + scope.data.details[i][allocate_by_field];
		}
		if(mau!=0){
			for(var i=0;i<scope.data.details.length;i++){
				scope.data.details[i]["tien_phi_nt"] =  Math.round( (scope.data.details[i][allocate_by_field]/mau) * t_cp_nt,scope.round);

				scope.data.details[i]["tien_phi"] = Math.round( (scope.data.details[i][allocate_by_field]/mau) * t_cp,0);
				
				scope.data.details[i].tien_nhap_nt = scope.data.details[i].tien_hang_nt - scope.data.details[i].tien_ck_nt + scope.data.details[i].tien_phi_nt;
				scope.data.details[i].tien_nhap =  scope.data.details[i].tien_hang - scope.data.details[i].tien_ck + scope.data.details[i].tien_phi;
			}
		}
		alert("Chương trình đã thực hiện xong");
		
	}
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.gia_von = Math.round(r.gia_von_nt * newData,0);
					r.tien_hang = Math.round(r.tien_hang_nt * newData,0);
					r.tien_phi = Math.round(r.tien_phi_nt * newData,0);
					r.tien_ck = Math.round(r.tien_ck_nt * newData,0);
					
					r.tien_nhap = Math.round(r.tien_nhap_nt * newData,0);
				});
				angular.forEach(scope.data.vatvaos,function(r){
					r.t_tien = Math.round(r.t_tien_nt * newData,0);
					r.t_thue = Math.round(r.t_thue_nt * newData,0);
					
				});
				angular.forEach(scope.data.ctcpmhs,function(r){
					r.tien_cp = Math.round(r.tien_cp_nt * newData,0);
					
				});
			}
		}
	});
}

pn1Module.module.setDataSource2Print = function($scope,service,config){
	if(config.list){
		for(var i=0;i< config.list.length;i++){
			if(config.list[i].sel==true){
				$scope.dataSource = config.list[i];
				service.getSocai(id_app,$scope.dataSource._id).success(function(data){
					$scope.dataSource.socai = data;
				});
				break;
			}
		}
	}
}