var pn3Module = new baseVoucher('pn3','pn3',[],'Phiếu nhập chi phí mua hàng');
pn3Module.module.defaultValues ={
	vatvaos:[]
}
pn3Module.defaultValues4Detail = {
	tien_ck_nt:0,tien_ck:0,
}
pn3Module.defaultCondition4Search = {tu_ngay:new Date(),den_ngay:new Date(),so_ct:'',dien_giai:'',ma_kh:''};
pn3Module.prepareCondition4Search = function($scope,vcondition){
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
	
pn3Module.watchDetail = function(scope){
	scope.$watch('dt_current.tien_phi_nt',function(newData){
		if(newData!=undefined && scope.status.isOpened){
			scope.dt_current.tien_phi = Math.round(scope.dt_current.tien_phi_nt * scope.ngMasterData.ty_gia,0);
		}
	});
	scope.getPN = function(){
		var modalInstance = scope.$modal.open({
		templateUrl: 'modules/vouchers/pn3/templates/form-select-invoice.html',
		controller:  function($scope, $modalInstance,parentScope,$filter){
				$scope.condition ={tu_ngay:new Date(),den_ngay:new Date()};
				$scope.ngData = parentScope.ngData;
				$scope.dt_current = parentScope.dt_current;
				$scope.ngMasterData=parentScope.ngMasterData;
				$scope.masters =[];
				$scope.details=[];
				$scope.invoiceClick = function(_id){
					$scope.details=[];
					var master = _.find($scope.masters,function(m){
						return m._id = _id;
					});
					$scope.details= master.details;
				}
				$scope.loadInvoice = function(){
					$scope.masters =[];
					$scope.details=[];
					var url = "/api/" + id_app + "/getpn2fee?";
					url =url + "tu_ngay=" + $filter('date')($scope.condition.tu_ngay,'yyyy-MM-dd');
					url =url + "&den_ngay=" + $filter('date')($scope.condition.den_ngay,'yyyy-MM-dd');
					if($scope.condition.so_ct){
						url =url + "&so_ct=" + $scope.condition.so_ct;
					}
					scope.$http.get(url)
						.success(function(data){
							$scope.masters = data;
						})
						.error(function(error){
							$scope.masters =[];
							alert(error);
						});
				}
				$scope.ok = function (){
					parentScope.ngMasterData.details =[];
					var line =0;
					$scope.masters.forEach(function(m){
						if(m.sel){
							m.details.forEach(function(d){
								if(d.sel){
									d.line = line;
									parentScope.ngMasterData.details.push(d);
									line++;
								}
							});
						}
					});
					$modalInstance.close();
					
				};
				$scope.cancel = function () {
					$modalInstance.dismiss('cancel');
				};
			},
		size: "lg",
		resolve: {
			parentScope: function () {
				return scope;
			}
		  }
		});
	}
}
pn3Module.watchMaster = function(scope){
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
					r.tien_phi = Math.round(r.tien_phi_nt * newData,0);
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

pn3Module.module.setDataSource2Print = function($scope,service,config){
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