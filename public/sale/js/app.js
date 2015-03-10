"use strict";
var id_app;
var saleApp = angular.module("saleApp",[
	'ngRoute','ipCookie','ezfb','angular-carousel','ngDialog'
	,'homeModule'
]);
saleApp.config(function (ezfbProvider, $routeProvider) {
  ezfbProvider.setInitParams({
    appId: '841430392583969'
  });
  ezfbProvider.setLocale('vi_VN');
})

saleApp.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
}]);

saleApp.constant('_', window._);
saleApp.run(function($rootScope,ipCookie,ngDialog){
	$rootScope.server =""
	$rootScope.cart ={t_sl:0,t_tien:0,shops:{},listshops:[]};
	$rootScope.cart.newShop = function(app){
		var shop ={_id:app._id,name:app.name}
		var id_app = shop._id;
		shop.vts={};
		shop.listproducts=[]
		$rootScope.cart.shops[id_app] = shop;
		return shop;
	}
	$rootScope.cart.add2cartnoalert = function(product,app,sl){
		if(!sl) sl = 1;
		var shop = $rootScope.cart.shops[app._id];
		if(!shop){
			shop = $rootScope.cart.newShop(app);
		}
		var vt = shop.vts[product._id];
		if(!vt){
			vt = {_id:product._id,ma_vt:product.ma_vt,ten_vt:product.ten_vt,picture_thumb:product.picture_thumb,ma_dvt:product.ma_dvt
				,sl_xuat:sl,gia_ban_le:product.gia_ban_le,ty_le_ck:product.ty_le_ck,tien_ck_1_sp:product.tien_ck
				,gia_ban:product.gia_ban_le,gia_ban_nt:product.gia_ban_le,gia_ban_thuc:product.gia_ban_thuc};
		
			vt.tien_hang_nt = vt.sl_xuat * vt.gia_ban
			vt.tien_hang = vt.tien_hang_nt
			
			vt.tien_ck_nt = vt.sl_xuat * vt.tien_ck_1_sp
			vt.tien_ck = vt.tien_ck_nt
			
			vt.tien_nt = vt.tien_hang_nt - vt.tien_ck_nt;
			vt.tien = vt.tien_nt
			
			shop.vts[product._id] = vt;
		}else{
			vt.sl_xuat = vt.sl_xuat + sl;
			vt.tien_hang_nt = vt.sl_xuat * vt.gia_ban
			vt.tien_hang = vt.tien_hang_nt
			
			vt.tien_ck_nt = vt.sl_xuat * vt.tien_ck_1_sp
			vt.tien_ck =vt.tien_ck_nt
			
			vt.tien_nt = vt.tien_hang_nt - vt.tien_ck_nt;
			vt.tien = vt.tien_nt
		}
		return vt;
	}
	$rootScope.cart.add2cart = function(product,app,sl){
		var vt = $rootScope.cart.add2cartnoalert(product,app,sl);
		//apply to cart
		$rootScope.apply_cart();
		
		var dialog = ngDialog.open({
			template: 'templates/add2cart.html',
			scope: $rootScope,
			controller:function($scope){
				$scope.vt = vt
				$scope.shop = $rootScope.cart.shops[app._id];
				$scope.delete2cart = function(id_app,id_vt,sl,change){
					if($rootScope.cart.delete2cart(id_app,id_vt,sl,change)==0){
						$scope.close();
					}
				}
				$scope.close = function(){
					dialog.close();
				}
			}
		});
	}
	$rootScope.cart.add2like = function(vt){
	}
	$rootScope.cart.delete2cart = function(id_app,id_vt,sl,change){
		var shop = $rootScope.cart.shops[id_app];
		if(!shop) return 0;
		if(sl==0) {
			delete shop.vts[id_vt]//delete all
			$rootScope.apply_cart();
			return 0;
		}else{
			var vt = shop.vts[id_vt];
			if(!vt){
				$rootScope.apply_cart();
				return 0;
			}
			if(change){
				vt.sl_xuat = sl;
			}else{
				vt.sl_xuat = vt.sl_xuat + sl;
			}
			
			if(vt.sl_xuat<=0){
				delete shop.vts[id_vt]//delete all
				$rootScope.apply_cart();
				return 0;
			}else{
				vt.tien_hang_nt = vt.sl_xuat * vt.gia_ban
				vt.tien_hang = vt.tien_hang_nt
				
				vt.tien_ck_nt = vt.sl_xuat * vt.tien_ck_1_sp
				vt.tien_ck =vt.tien_ck_nt
				
				vt.tien_nt = vt.tien_hang_nt - vt.tien_ck_nt;
				vt.tien = vt.tien_nt
			}
		}
		if(_.keys(shop.vts).length==0){
			delete $rootScope.cart.shops[id_app];
			$rootScope.apply_cart();
			return 0;
		}
		$rootScope.apply_cart();
		return vt.sl_xuat;
		//apply to cart
	}
	$rootScope.apply_cart = function(){
		var count =0;
		var money =0;
		var listshops = [];
		var save_listproducts = {};
		var save_listshops = {};
		for(var s in $rootScope.cart.shops){
			var shop = $rootScope.cart.shops[s];
			save_listshops[shop._id] = {_id:shop._id,name:shop.name};
			listshops.push(shop);
			var listproducts=[];
			var t_tien=0
			var t_sl =0;
			for(var vt in shop.vts){
				count = count + shop.vts[vt].sl_xuat;
				money = money + shop.vts[vt].tien;
				t_tien = t_tien + shop.vts[vt].tien;
				t_sl = t_sl + shop.vts[vt].sl_xuat;
				listproducts.push(shop.vts[vt]);
			}
			shop.t_sl = t_sl
			shop.t_tien = t_tien;
			shop.listproducts = listproducts;
			save_listproducts[s] = listproducts;
		}
		$rootScope.cart.listshops = listshops;
		
		$rootScope.cart.t_sl=count;
		$rootScope.cart.t_tien=money;
		ipCookie('products',save_listproducts,{expires: 2});
		ipCookie('apps',save_listshops,{expires: 2});
	}
	$rootScope.restore_cart= function(){
		$rootScope.cart.shops={}
		var products = ipCookie('products');
		var apps = ipCookie('apps');
		if(apps && products){
			for(var a in products){
				var app = apps[a]
				if(app){
					products[a].forEach(function(product){
						$rootScope.cart.add2cartnoalert(product,app,product.sl_xuat);
					});
				}
			}
			$rootScope.apply_cart();
		}
		
	}
	$rootScope.restore_cart();
	
});
