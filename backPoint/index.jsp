






<!doctype html>
<html id="ng-app" ng-app="BoandaApp" class="fontDefault" ng-cloak
	  ng-init="CurrUser={};CurrUser.YHID='08f3f12557ca4d1f9114f59234aa5392';CurrUser.YHMC='超级管理员';CurrUser.BMBH='QT';CurrUser.BMMC='其他';behaviorInfo=[];">
	<head>
		<!-- 
		/WEB-INF/views/platform/index.jsp
		 -->
		<title id="PLATFORM_LOGIN_BODY">
			浙江省生态环境保护综合协同管理平台　|　水环境承载力评价
		</title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="pragma" content="no-cache" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="0" />
		<meta name="renderer" content="webkit">
		<meta http-equiv="Page-Enter" content="blendTrans(Duration=0.5)" />

		<link type="text/css" rel="stylesheet" href="/zjshj/resources/power/ui/vendor/css/vendor1.min.css?v=201908300124">
		<link type="text/css" rel="stylesheet" href="/zjshj/resources/power/ui/vendor/css/vendor2.min.css?v=201908300124">
		<link type="text/css" rel="stylesheet" href="/zjshj/resources/power/ui/vendor/css/vendor3.min.css?v=201908300124">

		<link rel="shortcut icon" type="image/x-icon" href="/zjshj/resources/images/favicon.ico" />
		<link rel="stylesheet" type="text/css" href="/zjshj#" />

		
		<!--[if lt IE 9]>
		<script src="/zjshj/resources/component/angular/angular-1.2.1.min.js"></script>
		<script src="/zjshj/resources/component/angular/angular-1.2.1-cookies.min.js"></script>
		<script src="/zjshj/resources/component/angular/angular-1.2.1-animate.js"></script>
		<script src="/zjshj/resources/component/angular/angular-1.2.1-sanitize.min.js"></script>
		<script src="/zjshj/resources/component/jquery/jquery-1.12.4.min.js"></script>
		<script src="/zjshj/resources/component/layer/layer.js"></script>
		<link href="/zjshj/resources/component/layer/skin/default/layer.css" rel="stylesheet">
		<link href="/zjshj/resources/component/layer/skin/default/layer.ext.css" rel="stylesheet">
		<![endif]-->
		
		<script>
			WEB_APP_ROOT_PATH = '/zjshj';
		</script>

		
		<script language="JavaScript" type="text/javascript" src="/zjshj/resources/power/ui/vendor/js/powerui-component.min.js?v=201908300124"></script>
		<script language="JavaScript" type="text/javascript" src="/zjshj/resources/power/ui/vendor/js/powerui-tools.js?v=201908300124"></script>
		
		<script language="JavaScript" type="text/javascript" src="/zjshj/resources/platform/common/component/queryservice/tableExport/tableExport.js"></script>
		

		<script>
			/* function getTopWindow(window) {
			    if (window.frameElement && window.frameElement.tagName == "IFRAME") {
			     	// 判断本页面是否跨域打开
			     	TOP_WINDOW = window.parent;
			     	getTopWindow(window.parent);
			    } else if (window.opener) {
			        // 这个对layer有影响，导致在父窗口打开；
			        //TOP_WINDOW = window.opener;
			     	//getTopWindow(window.opener);
			    }
			}
			getTopWindow(self); */
			var countOpenNum = 0;//记录回调次数
			function getTopWindow(window, childrenWin) {
		      	try {
		      		//回调次数大于6返回
		      		if(countOpenNum>6){
		      			return;
		      		}
		      		countOpenNum++;
		        	if (window.frameElement && window.frameElement.tagName == "IFRAME") {
		          		// 判断本页面是否跨域打开
		          		childrenWin = window;
		          		TOP_WINDOW = window.parent;
		          		getTopWindow(window.parent, window);
		        	} else if (window.parent) {
		          		childrenWin = window;
		          		TOP_WINDOW = window.parent;
		          		getTopWindow(window.parent, window);
		        	}
		      	} catch(err){
		         	console.log(err);
		         	console.log("getTopWindow大概是跨域导致报错了，小伙子");
		         	TOP_WINDOW = childrenWin;
		      	}
	    	}
	    	getTopWindow(self, null);
	    	// 解决IE浏览器下TOP_WINDOW会为null，导致页面报错
	        if(TOP_WINDOW == null){
	          TOP_WINDOW = window;
	        }
			TOP_WINDOW.window.sessionID = '08f3f12557ca4d1f9114f59234aa5392';
			TOP_WINDOW.window.TOKEN = '5aa2dc62-a1ce-4b64-adbd-524c2a54c90c';
			sessionStorage.setItem('token', '5aa2dc62-a1ce-4b64-adbd-524c2a54c90c');
			TOP_WINDOW.window.SYSVERSION = '201908300124';
			sessionStorage.setItem('WEB_ROOT', '/zjshj');
			//window.WEB_ROOT = '/zjshj';
			TOP_WINDOW.window.USER_TENANT_ID = '';
		</script>

	
		
</head>
<link rel="stylesheet" href="/zjshj/resources/platform/common/js/animate.min.css">

<body class="home-page" ng-init="yhmc='超级管理员';">
<link rel="stylesheet" type="text/css" href="/zjshj/resources/platform/index/css/index-default.css" />
<link rel="stylesheet" type="text/css" href="/zjshj#" />
<script>
    var userSet = {
 "list": [
 {
 "name": "个人中心",
 "property": {
 "height": "390px",
 "title": "个人信息设置",
 "width": "600px"
 },
 "type": "1",
 "url": "/platform/rms/usercontroller/userset"
 },
 {
 "name": "个人管理",
 "property": {},
 "type": "0",
 "url": "/platform/rms/usercontroller/personcenter"
 }
 ]
};
</script>
<div ng-controller="indexController" id="indexPage" class="container-fluid " style="height: 100%;overflow: hidden"  data-webRoot="/zjshj">
	<!-- <link id="skinTheme" rel="stylesheet" type="text/css" href="{{skinItem}}" /> -->
	<div class="row header clear"  style="position: relative">
		<img src="resources/smart/menu/images/logo_sd.png" class="logo">
		<div class="headerContent" ng-mouseleave="hideAllMenu()">
			<ul class="clear">
                <!-- 一级菜单 -->
				<div class="firstMenu">
					<li id="backToIndex" ng-if="false">
						<span ng-click="backToIndex($event)" ng-mouseenter="isPortalActive = true" ng-mouseleave="isPortalActive = false"
		 					 ng-class="{true:'span-portal-on', false: 'span-portal'}[isPortalActive]">
		 					<div class="imgDiv"  ng-class="{true: 'titleImg', false: ''}[$index == 0]">
								<img src="/zjshj/resources/power/ui/vendor/images/menu_homepage.png">
							</div>
							<a>系统首页</a>
							<div class="portalBox" ng-show="isPortalActive">
								<div class="portalDiv" ng-show="isShowList">
									<p ng-repeat="item in allPortals">
										<span ng-class="{true: 'on', false: ''}[$index == 0]" data-value="{{item.value}}" ng-click="choosePortal(item, $event)">{{item.name}}</span>
									</p>
								</div>
							</div>
						</span>
					</li>
                    
					<li ng-repeat="item in allMenuItem.menuFirst | limitTo : 5" id="{{item.CDBH}}" on-finish-render-filters>
						<div  ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)" class="imgDiv">
							<img src="/zjshj{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
						</div>
						<div ng-if="item.CDURL" ng-click="openMenuCenter($event,item)" class="imgDiv">
							<img src="/zjshj{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
						</div>
						<a ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)">{{item.CDMC}}</a>
						<a ng-if="item.CDURL" ng-click="openMenuCenter($event,item)">{{item.CDMC}}</a>
					</li>
				</div>
				<li ng-if="allMenuItem.menuFirst.length >= 6"><span class="breadMenu-icon" ng-class="{true: 'breadMenu-on', false: 'breadMenu'}[isShowAllFirstMenu]" ng-click="showHideAllMenu()" ></span></li>
			</ul>
			<div class="mession-list clear" ng-show="isShowAllFirstMenu">
				<div ng-repeat="item in allMenuItem.menuFirst | after: 5" class="mession-list-item" id="{{item.CDBH}}">
					<div  ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)" class="imgDiv">
						<img src="/zjshj{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
					</div>
					<div ng-if="item.CDURL" ng-click="openMenuCenter($event,item)" class="imgDiv">
						<img src="/zjshj{{item.TPLJ}}" ng-class="{true: 'titleImg', false: ''}[$index >= 0]"/>
					</div>
					<a ng-if="!item.CDURL" ng-click="openMenuLeft($event,item)">{{item.CDMC}}</a>
					<a ng-if="item.CDURL" ng-click="openMenuCenter($event,item)">{{item.CDMC}}</a>
				</div>
			</div>


		</div>
		

		<div class="pt-tools">
			<span class="info header-rt" ng-class="{true:'span-info-on', false: 'span-info'}[isUserSetActive]">
				<div style="text-align:left;" ng-mouseenter="isUserSetActive = true" ng-mouseleave="isUserSetActive = false">
					<em ng-click="openUserSet()">{{yhmc}}&nbsp;&nbsp;</em>
					<div class="outerBox" ng-show="isUserSetActive" ng-if="userSetList.length">
						<div class="userSetDiv">
							<p ng-repeat="item in userSetList">
								<span ng-click="clickUserSetList(item,$event)">{{item.name}}</span>
							</p>
						</div>
					</div>
					<span style="float:right;padding-top:10px" ng-mouseenter="isExitActive = true;isUserSetActive = false" ng-mouseleave="isExitActive = false">
						<i ng-class="{true: 'icon-exit-on', false: 'icon-exit'}[isExitActive]" title="退出系统" ng-click="openQuitConfirm()"></i>
					</span>
				</div>

			</span>
			<div id="tools">
			<span class="toolBtn">
				<span id="message" ng-click = "clickBell($event)" style="padding-left: 90px;"></span>
				<!-- <span ng-show="searchInput">
					<i ng-class="{true: 'icon-search-on', false: 'icon-search'}[isSearchActive]" title="字体设置"
					   ng-mouseenter="isSearchActive = true" ng-mouseleave="isSearchActive = false" ng-click="openSearch()"></i>
					<div class="search-bar">
						<div class="input-block">
							<input type="text" class="search-txt">
							<input type="button" class="search-btn">
							<div class="select-box">
								<span class="select-txt">人员</span>
								<span class="select-btn"></span>
								<select name="" id="">
									<option value="人员" selected="selected">人员</option>
									<option value="部门">部门</option>
								</select>
							</div>
						</div>
					</div>
				</span> -->

				<!-- <span ng-mouseenter="isFontActive = true" ng-mouseleave="isFontActive = false"
					  ng-class="{true:'span-font-on', false: 'span-font'}[isFontActive]">
					<i ng-class="{true: 'icon-font-on', false: 'icon-font'}[isFontActive]" title="字体设置"></i>
					<div class="outerBox" ng-show="isFontActive">
						<div class="fontDiv">
							<p><span style="font-size: 15px" ng-click="chooseFont('big',$event)">大</span></p>
							<p><span style="font-size: 14px" class="on" ng-click="chooseFont('default',$event)">中</span></p>
							<p><span style="font-size: 12px" ng-click="chooseFont('small',$event)">小</span></p>
						</div>
					</div>
				</span> -->

				 

				<span ng-show="false" ng-mouseenter="isSetActive = true" ng-mouseleave="isSetActive = false">
					<i
					   ng-class="{true: 'icon-set-on', false: 'icon-set'}[isSetActive]"  title="设置个人信息">

					</i>
				</span>
			</span>
			</div>
		</div>
	</div>
	<div class="row wrapper clear" ng-model="changeCss">
		<div class="menuContent">
			<div class="menuBig" ng-show="isShowBigMenuBox">
				<div class="bigMenuBox">
					<div class="sliderBox">
						<p class="icon-big-menu-0" ng-click="changeMenuBox()"></p>
						
						
						<!-- 二级菜单列表 -->
						
						<div class="big-menu-box">
							<div class="hide parent_{{item.parentbh}}" ng-repeat="item in allMenuItem.menuSecond" on-finish-render-filters>
								<div class="menu-title" id="{{item.CDBH}}" style="text-align:left">
									<img ng-src="/zjshj{{item.TPLJ}}">
									<span ng-click="openWinLink(item,$event)">
										{{item.CDMC}}
									</span>
									<i class="sidebar-title-icon show-up" ng-class="item.showicon"  ng-click="changeMenuUpDown(item,$event)" ng-if="item.children.length"></i>
								</div>
								<ul class="menu-item" ng-if="item.sign">
									<li ng-repeat="children in item.children" id="{{children.CDBH}}" title="{{children.CDMC}}"
										ng-click="openWinLink(children,$event)">{{children.CDMC}}</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
            <!-- 以及菜单收缩切换 -->
			<div class="menuSmall"  ng-show="!isShowBigMenuBox">
				<ul>
					<li id="openMenuBig" class="icon-nav-0" data-text="展开菜单" ng-click="changeMenuBox()" ng-mouseenter="showTips($event)"
						ng-mouseleave="hideTips($event)"></li>
					<li ng-repeat="item in allMenuItem.menuSecond"  id="min-icon-{{item.CDBH}}" on-finish-render-filters data-text="{{item.CDMC}}" class="hide iconMenu parent_{{item.parentbh}}"
						ng-click="clickMenuSmall(item,$event)" ng-mouseenter="showTips($event)" ng-mouseleave="hideTips($event)">
						<img ng-src="/zjshj{{item.TPLJ}}">
					</li>
				</ul>
			</div>

		</div>
		 <div title="点击进行左右拖动改变大小" tabindex="1" ng-show="isShowBigMenuBox" class="dragbar"></div>
		<div class="content">
			<div class="history"></div>
			<div class="mainWindow">
				<iframe id="boandaContent" name="boandaContent" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
						style="width: 100%;height: 100%;" src="">
				</iframe>

				<input id="defaultIframeURL" type="hidden" value="/zjshj/frontal/index.html#/gisCzlpj">
				<input id="isShowHomePage" type="hidden" value="false">

			</div>
		</div>
	</div>
	<footer ng-if="false" class="row footer">
				技术支持：深圳市博沃智慧信息技术股份有限公司
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：400-880-2673
</div>
</body>

<script type="text/javascript" src="/zjshj/resources/platform/index/index.js?v=201908300124"></script>


<!-- 
<div ng-show="false" ng-controller="UserBehaviorController"></div>
 -->
<div ng-show="false" ng-controller="ButtonAuthorityController"></div>
<div ng-show="false" ng-controller="setUserSkinController"></div>
<div ng-show="false" ng-controller="WebSocketController"></div>

<script>
	$(function () {
        Common.contentShow.init(); //iframe内部具体内容的框架高度和宽度在浏览器窗口大小变化时自适应
    });

	var behavorApp = null;
	try {
	 	// 初始化平台系统
		behavorApp = angular.module(APP_NAME);
	} catch (error) {
	    Common.log(error);
	    behavorApp = Common.initApp(['ui.grid.edit', 'ngAnimate', 'angular.filter','ngCookies']);;
	}
	var sessionID = TOP_WINDOW.window.sessionID ? TOP_WINDOW.window.sessionID : '';
	behavorApp.controller('setUserSkinController', ['$scope', '$http','$cookieStore','$window', function ($scope, $http,$cookieStore,$window) {
		$scope.UserSkin = JSON.parse($window.localStorage['UserSkin'] || '{}');
		if($scope.UserSkin && $scope.UserSkin.skinName){
			$('#colorLink').attr('href',Common.webRoot()+'/resources/platform/common/css/color-'+$scope.UserSkin.skinName+'.css');
			$('#loginColor').attr('href',Common.webRoot()+'/resources/login/login-'+$scope.UserSkin.skinName+'.css');
		}
	}]);


	//按钮权限控制	
	behavorApp.controller('ButtonAuthorityController', ['$scope', '$http', function ($scope, $http) {
		setTimeout(function(){
			if ($("*[bt-auth-id]").length > 0) {
				Common.send($scope, $http, {
					method: 'POST',
					url: Common.webRoot() + '/platform/rms/usercontroller/findcurrentuserbutton',
					success: function(result){
						var buttons = result.data;
						
						var btnElements = $("*[bt-auth-id]");
						for(var i=0;i<btnElements.length;i++){
							btnElements[i].style.display="none";
							if(buttons){
								for(var j=0;j<buttons.length;j++){
									if(btnElements[i].getAttribute("bt-auth-id") == buttons[j].ANXH && sessionStorage.getItem('currentMenu') && JSON.parse(sessionStorage.getItem('currentMenu')).CDBH == buttons[j].CDXH){
										btnElements[i].style.display="inline";
										break;
									}
								}
							}
						}
														
					}
				});
			}
		});
		
	}]);
	
	// WebSocket连接
	behavorApp.controller('WebSocketController', ['$scope', '$http', function ($scope, $http) {
		// 用户登录并且开启WebSocket配置项才连接websocket
		if ($scope.CurrUser.YHID && 'true' == 'true' && 'ws://127.0.0.1:8787/platform/ws') {
			platform.webSocket.connect($scope, $http, {
				url : 'ws://127.0.0.1:8787/platform/ws'
			});
		}
	}]);
	
	/*
	behavorApp.controller('UserBehaviorController', ['$scope', '$http', 'uiGridConstants', function ($scope, $http, uiGridConstants) {

		// 执行初始化
		platform.userBehavior.initUserBehavior();
		TOP_WINDOW.window.platform.userBehavior.setInterval($scope, $http);
		
	}]);
	*/
	
	// 离开页面时
	window.onbeforeunload = function() {
		
		for (key in platform.onbeforeunload.listeners) {
			var listener = platform.onbeforeunload.listeners[key];
			try {
				if (listener.func) {
					listener.func();
				}
			} finally {
				continue ;
			}
		}
	}
		
</script>
<script type="text/javascript" src="/zjshj/resources/power/ui/vendor/js/powerui-directive.js?v=201908300124"></script>


<script src="/zjshj/resources/script/common/raty/jquery.raty.min.js?v=201908300124"></script>

<!-- 统一UI适配  modify by luoyanbo 2021-05-28 15:46  start-->
<script>
    try {

        function initFun() {
            // 调整的高度，因菜单高度调整为了48px，故其他元素的高度也需要调整。
            var windowHeight = window.innerHeight;
            var headerHeight = 48;
            var footerHeight = $('footer').height();
            footerHeight = footerHeight?footerHeight:0;
            $('.wrapper').height((windowHeight - headerHeight - footerHeight) + 'px');
            $('.menuBig').height((windowHeight - headerHeight - footerHeight) + 'px');
            $('.menuSmall').height((windowHeight - headerHeight - footerHeight) + 'px');
            $('.dragbar').height((windowHeight - headerHeight - footerHeight) + 'px');
            $('.content').height((windowHeight - headerHeight - footerHeight) + 'px');
            $("#boandaContent").height((windowHeight - headerHeight - footerHeight) + 'px');
        }

        setTimeout(function(){
            //调整动态列表页面搜索区域
            $(".srh-area-wrap .srh-area span.btn-clear").html("&nbsp;重&nbsp;置&nbsp; ");
            $(".srh-area-wrap .srh-area span.btn-hsrh").click(function(){
                if ($(this).hasClass("on")) {
                    $(this).html("&nbsp;更&nbsp;多&nbsp;");
                } else {
                    $(this).html("&nbsp;收&nbsp;起&nbsp;");
                }
            });

            //调整左侧菜单栏 展示/搜索功能
            $(".menuContent .menuBig .bigMenuBox .sliderBox .icon-big-menu-0").html("<span style='position: relative;left: -63px;color: #a2adc5;'>&nbsp;收&nbsp;起&nbsp;</span>");

            //description：修改分页组件相关按钮图标；author：luoyanbo；date：2021/06/05 19:41:29
            if($(".pagination-sm.pagination").length > 0){
                $(".pagination-sm.pagination").each(function(i, e){
                    //将两个<组合成<<图标
                    var glyphiconFastBbackward = $(this).find(".glyphicon-fast-backward:first");
                    var glyphiconFastBbackwardClone = glyphiconFastBbackward.clone();
                    glyphiconFastBbackwardClone.attr("style","right: 6px; position: relative;");
                    glyphiconFastBbackwardClone.attr("id","glyphiconFastBbackwardClone");
                    glyphiconFastBbackward.after(glyphiconFastBbackwardClone);

                    //将两个>组合成>>图标
                    var glyphiconFastForward =$(this).find(".glyphicon-fast-forward:first");
                    var glyphiconFastForwardClone = glyphiconFastForward.clone();
                    glyphiconFastForwardClone.attr("id","glyphiconFastForwardClone");
                    glyphiconFastForwardClone.attr("style","right: 6px; position: relative;");
                    glyphiconFastForward.after(glyphiconFastForwardClone);
                });
            }

            $(window).resize(function(){
                initFun();
            });
            $(window).load(function(){
                initFun();
            });
            $(function(){
                initFun();
            });

            // 隐藏消息通知及退出按钮
            $('.icon-exit').parent().hide();
            $('.icon-message-content').parent().hide();
            $('.info em').css("border-right","0px");
            // 修改登录用户的显示名称
            var text = $('.pt-tools').children().eq(0).children().children().eq(0).text();
            if (text != null && text != '') {
                var left = "";
                if (text.trim().length <= 3) {
                    left = "-13px";
                } else {
                    left = "-30px";
                }
                $('.pt-tools').children().eq(0).children().children().eq(0).css({"margin-left":left,"color":"white"});
                $('.pt-tools').children().eq(0).children().children().eq(0).empty();
                $('.pt-tools').children().eq(0).children().children().eq(0).append("欢迎您，"+text);

                // 去除个人中心和修改密码
                $('.pt-tools').children().eq(0).children().children().eq(1).hide();

                // 去除点击事件
                var clone = $('.pt-tools').children().eq(0).children().children().eq(0).clone();
                $('.pt-tools').children().eq(0).children().children().eq(0).remove();
                $('.pt-tools').children().eq(0).children().prepend(clone);

            }


            // 去除菜单间的分割线
            $('.menu-item li').css('position','static');
            // 去除最后一个菜单底部的隔开线(如果最后一个菜单底部有隔开线的话添加，且id需要查看那个菜单的id来修改)
            $('#1619505700237025989120').removeAttr('style');

            // 隐藏菜单栏收起按钮
            $('.icon-big-menu-0').hide();

            // 调整logo
            var systemName = "浙江省生态环境保护综合协同管理平台　|　水环境承载力评价";
            var index = systemName.indexOf("|");
            var systemNamePre = systemName.substring(0,index);
            var systemNameSuf = systemName.substring(index+1,systemName.length);
            // 删除原来的logo
            $('.logo').remove();
            $('#indexPage').children().eq(0).prepend("<div class='logodiv'><label>"+systemNamePre+"<span id='spanColor'>|</span>"+systemNameSuf+"</label></div>");

        },200);
    } catch(e) {
        console.log("统一UI调整报错！");
    }

</script>
<style type="text/css">
    .logodiv {
        margin: 0;
        float: left;
        margin-top: 10px;
        display: block;
        min-width: 170px;
        vertical-align: middle;
        font-size:16px;
        color: white;
        text-align:center;
        margin-left:20px;
        margin-right:20px;
        margin-top:13px;
    }

    #spanColor {
        color:#8c8b8b
    }
</style>
<!-- 统一UI适配  modify by luoyanbo 2021-05-28 15:46  start-->
</html>