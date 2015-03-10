var pblModule = new baseVoucher('pbl','pbl',[],'Phiếu bán lẻ');
pblModule.module.defaultValues ={
	ty_le_ck_hd:0,tien_ck_hd:0
}
pblModule.defaultValues4Detail = {
	sl_xuat:0,
	ty_le_ck:0,
	gia_von_nt:0,gia_von:0,
	gia_ban_nt:0,gia_ban:0,
	tien_nt:0,tien:0,
	tien_ck_nt:0,tien_ck:0,
	px_gia_dd:false,
	tien_xuat_nt:0,tien_xuat:0
}
pblModule.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pblModule.prepareCondition4Search = function($scope,vcondition){
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
	
pblModule.watchDetail = function(scope){
	scope.$watch('dt_current.sl_xuat',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_xuat_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
			scope.dt_current.tien_hang_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_ban_nt,scope.round);
			scope.dt_current.tien_xuat = scope.dt_current.tien_xuat_nt;
		}
	});
	scope.$watch('dt_current.gia_ban_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_ban_nt,scope.round);
		}
	});
	scope.$watch('dt_current.gia_ban',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_hang = Math.round(scope.dt_current.gia_ban * scope.dt_current.sl_xuat,0);
		}
	});
	scope.$watch('dt_current.tien_hang_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_hang_nt * scope.dt_current.ty_le_ck/100,scope.round);
			scope.dt_current.tien_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt
			scope.dt_current.tien_hang = Math.round(scope.dt_current.tien_hang_nt * scope.ngMasterData.ty_gia,0);
		}
	});
	scope.$watch('dt_current.tien_hang',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_hang * scope.dt_current.ty_le_ck/100,0);
			scope.dt_current.tien = scope.dt_current.tien_hang - scope.dt_current.tien_ck
		}
	});
	
	scope.$watch('dt_current.gia_von_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.gia_von =scope.dt_current.gia_von_nt;
			scope.dt_current.tien_xuat_nt = Math.round( scope.dt_current.sl_xuat * scope.dt_current.gia_von_nt,scope.round);
			scope.dt_current.tien_xuat = scope.dt_current.tien_xuat_nt;
		}
	});

	
	scope.$watch('dt_current.ty_le_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck_nt = Math.round(scope.dt_current.tien_nt * scope.dt_current.ty_le_ck/100,scope.round);
			
		}
	});
	
	scope.$watch('dt_current.tien_ck_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_ck = Math.round(scope.dt_current.tien_ck_nt * scope.ngMasterData.ty_gia,0);
			scope.dt_current.tien_nt = scope.dt_current.tien_hang_nt - scope.dt_current.tien_ck_nt
		}
	});
	scope.$watch('dt_current.tien_ck',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien = scope.dt_current.tien_hang - scope.dt_current.tien_ck
		}
	});
}
pblModule.watchMaster = function(scope){
	scope.$watch('data.ty_gia',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				angular.forEach(scope.data.details,function(r){
					r.tien_hang = Math.round(r.tien_hang_nt * newData,0);
					r.tien_ck = Math.round(r.tien_ck_nt * newData,0);
					r.tien_xuat = r.tien_xuat_nt;
				});
				scope.data.t_thue = Math.round(scope.data.t_thue_nt * newData,0)
			}
		}
	});
	scope.$watch('data.t_tien_nt',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue_nt = Math.round((scope.data.t_tien_nt-scope.data.t_ck_nt) * scope.data.thue_suat/100,scope.round);
				scope.data.t_thue = Math.round(scope.data.t_thue_nt * scope.data.ty_gia,0)
			}
		}
	});
	scope.$watch('data.ty_le_ck_hd',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.tien_ck_hd = Math.round((scope.data.t_tien_nt-scope.data.t_ck_nt) * scope.data.ty_le_ck_hd/100,0);
			}
		}
	});
	scope.$watch('data.t_tien',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.t_thue = Math.round((scope.data.t_tien-scope.data.t_ck) * scope.data.thue_suat/100,0);
			}
		}
	});
	scope.$watch('data.tien_thu',function(newData){
		if(scope.data){
			if(newData!=undefined && scope.isDataLoaded){
				scope.data.con_no = scope.data.t_tt-scope.data.tien_thu;
			}
		}
	});
}

pblModule.module.setDataSource2Print = function($scope,service,config){
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