/*Copyright (C) 2015  Sao Tien Phong (http://saotienphong.com.vn)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";
var id_app;
var access_token;
var paths_not_require_id_app = ['code','app','colleague','notification','message','profile','users'];
var accApp = angular.module("accApp",[
		'ngRoute','ui.bootstrap','angular-loading-bar','ngAnimate','luegg.directives',"highcharts-ng",'ngCookies','ngToast'
		,'appInfoService','loginModule','appModule','colleagueModule','notificationModule','messageModule','usersModule','rptModule'
		,'dashboardModule'
		,'dvcsModule','dmntModule','dmtkModule','dmkhModule','dmtcModule','dmvatModule','dmdvtModule','dmvtModule','dmnvtModule','dmkhoModule','ptthanhtoanModule'
		,'dmcpmhModule','ctcpmhModule'
		,'cdtkModule','cdkhModule','cdvtModule','cddtModule'
		,'sctdtModule','cdpsdtModule'
		,'bkctModule','searchModule','cdpstkModule','scttkModule','sctcnkhModule','cdpskhModule'
		,'bcdktModule','kbmbcdktModule'
		,'bkvatvaoModule','bkvatraModule'
		,'kbmkqhdkdModule','kqhdkdModule'
		,'kbmlcttttModule','lcttttModule'
		,'kbmlcttgtModule','lcttgtModule'
		,'thnxtModule','sctvtModule','tinhgiatbModule'
		,'vatvaoModule','vatraModule','kbmtkgtgtModule','tkgtgtModule'
		,'pktModule','dmkcModule','pkcModule'
		,'pn1Module','pn2Module','pn5Module','pn3Module'
		,'hd2Module','hd1Module','hd3Module','pblModule','so1Module'
		,'pnkModule','pxkModule','pxcModule'
		,'tdttcoModule','tdttnoModule'
		,'pc1Module','pt1Module'
		,'dmbpModule','dmdtModule'
		,'dmloaitsModule','dmtanggiamtsModule','dmnguonvonModule','qtsModule','tinhkhauhaotsModule','hspbtsModule','dckhauhaotsModule','pkhModule'
		,'dtbanletheongayModule','dtbanletheothangModule','dtbanletheoquyModule','dtbanletheonamModule','dtbanletheovtModule','dtbanletheokhModule','ctbanleModule'
	]);
accApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
   cfpLoadingBarProvider.includeSpinner = false;
}])
// allow DI for use in controllers, unit tests
accApp.constant('_', window._);
accApp.constant('async', window.async);

//neu ham api nao tra ve loi 401 thi redirect to trang login
accApp.factory('httpInterceptor', function httpInterceptor ($q, $window, $location,$rootScope) {
  return function (promise) {
      var success = function (response) {
		  //$rootScope.isLogined = true;
          return response;
      };
      var error = function (response) {
          if (response.status === 401) {
			  $rootScope.isLogined = false;
              $location.url('/login');
          }
          return $q.reject(response);
      };
      return promise.then(success, error);
  };
});
//set token to header cho tat ca ca ham api
accApp.factory('api', function ($http, $cookies,$rootScope) {
  return {
      init: function (token) {
			if(!token){
				token = $cookies.token;
				if(token){
					token = eval("(" + token + ")");
				}
			}
			if(!token){
				$rootScope.isLogined = false;
			}else{
				$rootScope.isLogined = true;
			}
			//console.log(token);
		  access_token = token;
          $http.defaults.headers.common['X-Access-Token'] = token;
      }
  };
});
//khai bao de su dung thu vien async, underscope, init api
accApp.run(function ($rootScope,api,colleague,$window,user,app,$location) {
     $rootScope.async = window.async;
	 $rootScope.isLogined = false;
	 $rootScope.program_name = "OPEN ACCOUNTING";
	 $rootScope.program_version = "0.0.1 Beta";
	 $rootScope._ = window._;
	 $rootScope.commands = [
		{module:'Chứng từ',visiable:true,open:true,icon:'fa fa-edit fa-fw',items:[
			{group:'Kế toán tiền',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'pt1',type:'V',header:'Phiếu thu',visiable:true},
				{path:'pc1',type:'V',header:'phiếu chi',visiable:true}
			]},
			{group:'Kế toán bán hàng',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'so1',type:'V',header:'Đơn đặt hàng',visiable:true},
				{path:'hd2',type:'V',header:'Hóa đơn bán hàng',visiable:true},
				{path:'hd3',type:'V',header:'Hàng bán bị trả lại',visiable:true},
				{path:'hd1',type:'V',header:'Bán dịch vụ',visiable:true},
				{path:'pbl',type:'V',header:'Phiếu bán lẻ',visiable:true}
			]}
			,
			{group:'Kế toán mua hàng',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'pn1',type:'V',header:'Mua hàng trong nước',visiable:true},
				{path:'pn9',type:'V',header:'Nhập khẩu',visiable:false},
				{path:'pn3',type:'V',header:'Chi phí mua hàng',visiable:true},
				{path:'pn5',type:'V',header:'Trả lại nhà cung cấp',visiable:true},
				{path:'pn2',type:'V',header:'Mua dịch vụ',visiable:true}
			]}
			,
			{group:'Kế toán kho',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'pnk',type:'V',header:'Nhập kho nội bộ',visiable:true},
				{path:'pxk',type:'V',header:'Xuất kho nội bộ',visiable:true},
				{path:'pxc',type:'V',header:'Điều chuyển kho',visiable:true},
				{path:'tinhgiatb',type:'R',header:'Tính giá trung bình',visiable:true}
			]},
			{group:'Giá thành sản xuất sản phẩm',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'dxd',header:'Cập nhật đầu kỳ',visiable:true},
				{path:'dxd',header:'Điều chỉnh đầu kỳ',visiable:true},
				{path:'dxd',header:'Khai báo phân bổ',visiable:true},
				{path:'dxd',header:'Điều chỉnh cuối kỳ',visiable:true},
				{path:'dxd',header:'Tính giá thành',visiable:true},
				{path:'dxd',header:'Điều chỉnh giá thành',visiable:true},
				{path:'dxd',header:'Cập nhật giá cho các phiếu nhập',visiable:true}
			]}
			,
			{group:'Kế toán tổng hợp',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'pkt',type:'V',header:'Phiếu kế toán',visiable:true},
				{path:'pkc',type:'V',header:'Phiếu kết chuyển cuối kỳ',visiable:true},
				{path:'dmkc',type:'L',header:'Khai báo bút toán kết chuyển cuối kỳ',visiable:true}
			]}
			,
			{group:'Quản lý tài sản và công cụ',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'qts',type:'V',header:'Cập nhập tài sản, công cụ',visiable:true},
				{path:'hspbts',type:'L',header:'Khai báo hệ số phân bổ khấu hao',visiable:true},
				{path:'tinhkhauhaots',type:'R',header:'Tính khấu hao tài sản',visiable:true},
				{path:'dckhauhaots',type:'L',header:'Điều chỉnh khấu hao tài sản',visiable:true},
				{path:'pkh',type:'V',header:'Hoạch toán khấu hao tài sản',visiable:true}
			]}
		]},
		{module:"Báo cáo",visiable:true,icon:'fa fa-bar-chart-o fa-fw',items:[
			{group:'Kế toán',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'bkct',header:'Bảng kê chứng từ',visiable:true},
				{path:'cdpstk',header:'Cân đối phát sinh tài khoản',visiable:true},
				{path:'scttk',header:'Sổ cái tài khoản',visiable:true},
				{path:'sctcnkh',header:'Sổ chi tiết công nợ của một khách hàng',visiable:true},
				{path:'cdpskh',header:'Cân đối phát sinh theo khách hàng',visiable:true}
			]},
			{group:'Hàng tồn kho',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'thnxt',header:'Tổng hợp nhập xuất tồn',visiable:true},
				{path:'sctvt',header:'Sổ chi tiết vật tư',visiable:true}
			]},
			{group:'Bán hàng',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'dtbanletheongay',header:'Doanh thu bán lẻ theo ngày',visiable:true},
				{path:'dtbanletheothang',header:'Doanh thu bán lẻ theo tháng',visiable:true},
				{path:'dtbanletheoquy',header:'Doanh thu bán lẻ theo quý',visiable:true},
				{path:'dtbanletheonam',header:'Doanh thu bán lẻ theo năm',visiable:true},
				{path:'dtbanletheovt',header:'Doanh thu bán lẻ theo sản phẩm',visiable:true},
				{path:'dtbanletheokh',header:'Doanh thu bán lẻ theo khách hàng',visiable:true},
				{path:'ctbanle',header:'Chi tiết bán lẻ',visiable:true},
				
				{path:'dxd',header:'Chi tiết bán hàng',visiable:true},
				{path:'dxd',header:'Tổng hợp bán hàng',visiable:true},
				{path:'dxd',header:'Hóa đơn bán hàng theo hạn thanh toán',visiable:true},
				{path:'dxd',header:'Hàng bán bị trả lại',visiable:true}
			]},
			{group:'Mua hàng',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'dxd',header:'Chi tiết mua hàng',visiable:true},
				{path:'dxd',header:'Tổng hợp mua hàng',visiable:true},
				{path:'dxd',header:'Hóa đơn mua hàng theo hạn thanh toán',visiable:true},
				{path:'dxd',header:'Trả lại nhà cung cấp',visiable:true}
			]},
			{group:'Giá thành theo vụ việc, dự án',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'sctdt',header:'Sổ chi tiết',visiable:true},
				{path:'cdpsdt',header:'Cân đối phát sinh',visiable:true},
				{path:'dxd',header:'Tổng hợp chi phí sản xuất',visiable:true},
				{path:'dxd',header:'Kết quả kinh doanh',visiable:true}
			]},
			{group:'Giá thành sản xuất sản phẩm',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'dxd',header:'Thẻ giá thành',visiable:true},
				{path:'dxd',header:'Tổng hợp giá thành',visiable:true}
			]},
			{group:'Báo cáo thuế',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'bkvatra',header:'Bảng kê thuế đầu ra',visiable:true},
				{path:'bkvatvao',header:'Bảng kê thuế đầu vào',visiable:true},
				{path:'tkgtgt',header:'Tờ khai thuế GTGT',visiable:true}
			]},
			{group:'Báo cáo tài chính',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'cdpstk',header:'Cân đối phát sinh tài khoản',visiable:true},
				{path:'bcdkt',header:'Bảng cân đối kế toán',visiable:true},
				{path:'kqhdkd',header:'Kết quả hoạt động kinh doanh',visiable:true},
				{path:'lctttt',header:'Lưu chuyển tiền tệ trực tiếp',visiable:true},
				{path:'lcttgt',header:'Lưu chuyển tiền tệ gián tiếp',visiable:true},
				{path:'tmbctc',header:'Thuyết minh báo cáo tài chính',visiable:false}
			]},
		]}
		,
		{module:'Danh mục',visiable:true,icon:'fa fa-list fa-fw',items:[
			{group:'Danh mục',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'dvcs',type:'L',header:'Đơn vị cơ sở',visiable:true},
				{path:'dmtk',type:'L',module:'account',header:'Tài khoản',visiable:true},
				{path:'dmkh',type:'L',module:'customer',header:'Khách hàng',visiable:true},
				{path:'dmnt',type:'L',module:'currency',header:'Ngoại tệ',visiable:true},
				//{path:'dmvat',type:'L',header:'Thuế suất TGTGT',visiable:true},
				//{path:'dmtc',type:'L',header:'Tính chất thuế GTGT',visiable:true},
				{path:'dmnvt',type:'L',header:'Nhóm vật tư, hàng hóa',visiable:true},
				{path:'dmvt',type:'L',header:'Vật tư, hàng hóa',visiable:true},
				{path:'dmkho',type:'L',header:'Kho hàng',visiable:true},
				//{path:'dmdvt',type:'L',header:'Đơn vị tính của vật tư, hàng hóa',visiable:true},
				{path:'dmbp',type:'L',header:'Bộ phận',visiable:true},
				{path:'dmdt',type:'L',header:'Vụ việc',visiable:true},
				{path:'ptthanhtoan',type:'L',header:'Phương thức thanh toán',visiable:true},
				{path:'rpt',type:'L',header:'Quản lý mẫu in',visiable:true}
				
			]}
		]}
		,
		{module:'Đầu kỳ và kết chuyển qua năm',visiable:true,icon:'fa fa-plus-square-o fa-fw',items:[
			{group:'Số dư đầu kỳ',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'cdtk',type:'L',header:'Đầu kỳ tài khoản',visiable:true},
				{path:'cdkh',type:'L',header:'Đầu kỳ khách hàng',visiable:true},
				{path:'cdvt',type:'L',header:'Đầu kỳ vật tư',visiable:true},
				{path:'cddt',type:'L',header:'Đầu kỳ vụ việc',visiable:true}
			]},
			{group:'Kết chuyển sang năm sau',visiable:true,icon:'fa fa-folder fa-fw',items:[
				{path:'kcsns',header:'Kết chuyển sang năm sau',visiable:true}
			]}
		]}
	 ]
	 $rootScope.active_menu_class ="";
	 $rootScope.active_menu = function(){
		if(!$rootScope.active_menu_class){
			$rootScope.active_menu_class ="active";
		}else{
			$rootScope.active_menu_class ="";
		}
	 }
	 $rootScope.disable_menu = function(){
		$rootScope.active_menu_class ="";
		$window.scrollTo(0, 0);
	 }
	 $rootScope.searchword =""
	 $rootScope.searchAllKeyup = function($event,word){
		 if($event.keyCode===13){
			 if(word){
				$location.url("search/" + word);
			 }
		 }
	 }
	 $rootScope.notifies_count = 0;
	 $rootScope.messages_count = 0;
	 $rootScope.getMessages = function(callback){
		$rootScope.colleagues =[{content:'Đang lấy dữ liệu...'}];
		user.getMessagesColleagues(function(error,messages){
			if(error){
				$rootScope.messages_count = 0;
				$rootScope.msgs =[{content:'Không thể lấy dữ liệu từ server'}];
			}else{
				$rootScope.msgs = messages;
				$rootScope.messages_count = messages.length;
				
				if(callback){
					callback(messages)
				}
			}
		});
	 }
	 $rootScope.getInvitations = function(callback){
		$rootScope.notifies =[{content:'Đang lấy dữ liệu...'}];
		user.getNotifies(function(error,notifies){
			if(error){
				$rootScope.notifies_count = 0;
				$rootScope.notifies ={colls:[{content:'Không thể lấy dữ liệu từ server'}]};
			}else{
				$rootScope.notifies = notifies;
				$rootScope.notifies_count = notifies.colls.length + notifies.apps.length + notifies.notifications.length;
				if(callback){
					callback(notifies)
				}
				
			}
		});
	 }
	 $rootScope.acceptInvitor = function(code,id){
		if(code=="colleague"){
			colleague.active(id).success(function(data){
				if($location.url().indexOf("/colleague")==0 || $location.url().indexOf("colleague")==0){
					$window.location.reload();
				}
			}).error(function(error){
				alert("Không thể thực hiện thao tác này");
			});
		}
		if(code=="app"){
			app.active(id).success(function(data){
				if($location.url().indexOf("/app")==0 || $location.url().indexOf("app")==0){
					$window.location.reload();
				}
			}).error(function(error){
				alert("Không thể thực hiện thao tác này");
			});
		}
	 }
	 $rootScope.notAcceptInvitor = function(code,id){
		if(code=="colleague"){
			colleague.notaccept(id).success(function(data){
				if($location.url().indexOf("/colleague")==0 || $location.url().indexOf("colleague")==0){
					$window.location.reload();
				}
				
			}).error(function(error){
				alert("Không thể thực hiện thao tác này");
			});
		}
		if(code=="app"){
			app.notaccept(id).success(function(data){
				if($location.url().indexOf("/app")==0 || $location.url().indexOf("app")==0){
					$window.location.reload();
				}
				
			}).error(function(error){
				alert("Không thể thực hiện thao tác này");
			});
		}
		
	 }
	 api.init();
});
//check id app
var checkIdApp = function(code,$cookies,user,$rootScope,$location,app,callback){
	if(!id_app){
		id_app = $cookies.id_app;
		if(id_app){
			id_app = eval("(" + id_app + ")");
			$rootScope.id_app = id_app;
		}
	}
	if(!id_app && !_.contains(paths_not_require_id_app,code)){
		if(callback){
			callback("Lỗi: bạn phải chọn một công ty");
		}
		$location.url("/app");
		return false;	
		
	}
	//get user info
	if(!$rootScope.user){
		user.getInfo(function(e,u){
			if(e){
				if(callback){
					callback(e);
				}
				return;
			}
			//get app info
			if(!$rootScope.app_info && id_app){
				app.get(id_app,id_app).success(function(dt){
					$rootScope.app_info = dt;
					if(callback){
						callback(null,u,dt)
					}
				}).error(function(e){
					if(callback){
						callback(e);
					}
				});
			}else{
				if(callback){
					callback(null,u,$rootScope.app_info)
				}
				
			}
		});
	}else{
		//get app info
		if(!$rootScope.app_info && id_app){
			app.get(id_app,id_app).success(function(dt){
				$rootScope.app_info = dt;
				if(callback){
					callback(null,$rootScope.user,dt)
				}
			}).error(function(e){
				if(callback){
					callback(e);
				}
			});
		}else{
			if(callback){
				callback(null,$rootScope.user,$rootScope.app_info)
			}
			
		}
	}
	return true
}