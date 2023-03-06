/**
 * Created by Administrator on 2016/5/3.
 */
 var app =Common.initApp();
 Common.initRenderFinish(app);
 Common.initDirective(app);
 var webRoot = Common.webRoot();
 Notifier.element.toInitMessageHtml({
     id : 'message',
 });
 var initleftWidth = 280;
 var contentCSS = {
     setWidth : function (bool,className,width) {
         var leftWidth;
         className = className ? className : 'menuBig';
         var windowWidth = window.innerWidth;
         //如果给定了初始宽度，则设置
         if(width){
             initleftWidth = width;
             leftWidth = initleftWidth;
             $("."+className).width(initleftWidth + 'px')
             $(".bigMenuBox").width(initleftWidth + 'px')
             $(".sliderBox").width(initleftWidth + 'px')
         }else{
             // var leftWidth = $("."+className).width();
             if(bool && !className){
                 leftWidth  = $(".menuContent").width();
             }else if(!bool){
                 leftWidth = 0;
             }else if(bool == true && className){
                 leftWidth = $("."+className).width();
                 $(".menuContent").width(leftWidth + 'px');
             }
         }
        //边栏宽度
         var scollBoolWidth;
         if(bool == true){
             scollBoolWidth = 10
         }else{
             scollBoolWidth = 0;
         }
         var contentWidth = windowWidth - leftWidth - scollBoolWidth;
         var iframeWidth = windowWidth - leftWidth - scollBoolWidth ;
         if(contentWidth <= 998){
             iframeWidth = 992
         }
         if(platform.isWebkit()){
             $('.content').width(contentWidth + 'px');
             $("#boandaContent").width(iframeWidth + 'px');
         }else {
             $('.content').width(contentWidth  + 'px');
             $("#boandaContent").width(iframeWidth + 'px');
         }
     },
     setHeight : function () {
         var windowHeight = window.innerHeight;
         var headerHeight = 60;
         var footerHeight = $('footer').height();
         footerHeight = footerHeight?footerHeight:0;
         $('.wrapper').height((windowHeight - headerHeight - footerHeight) + 'px');
         $('.menuBig').height((windowHeight - headerHeight - footerHeight) + 'px');
         $('.menuSmall').height((windowHeight - headerHeight - footerHeight) + 'px');
         $('.dragbar').height((windowHeight - headerHeight - footerHeight) + 'px');
             $('.content').height((windowHeight - headerHeight - footerHeight) + 'px');
         $("#boandaContent").height((windowHeight - headerHeight - footerHeight) + 'px');
     },
     init : function(){
         contentCSS.setHeight();
         contentCSS.setWidth();
     }
 };
 var FirstMenuCSS = {
     setWidth : function (width) {
         width = width ? width : FirstMenuCSS.getMaxWidth();
         $('.mession-list').width(width + 'px');
         $('.firstMenu').width(width + 'px');
     },
     getMaxWidth : function () {
         var maxWidth = 0;
         var Width;
         var allMenu = $('.mession-list > li');
         allMenu.each(function(index,element){
             maxWidth = maxWidth > $(this).outerWidth() ? maxWidth : $(this).outerWidth();
         });
         if(allMenu.length > 7){
             Width = maxWidth * 8;
         }else{
             Width = maxWidth * allMenu.length;
         }
         return Width;
     },
     init : function () {
         FirstMenuCSS.setWidth();
     }
 };
 /**
  * 左侧自定义拖拽宽度
  */
 var DragChangeSize = {
         init: function() {
             var clickX, leftOffset, inxdex, nextW2, nextW;
             dragging = false;
             doc = document;
             dragBtn = $(".wrapper").find('.dragbar');
             wrapWidth = $(".wrapper").width();
 
             this.mousedown();
             this.onmousemove();
             this.mouseup();
         },
         mousedown: function() {
             var _this = this;
             dragBtn.mousedown(function(event) {
                 dragging = true;
                 leftOffset = $(".wrapper").offset().left;
                 index = $(this).index('.dragbar');
                 e.cancelBubble = true; //禁止事件冒泡
             });
             dragBtn.blur(function(event) {
                 dragging = false;
           });
             dragBtn.mouseup(function(event) {
                 dragging = false;
             });
         },
         onmousemove: function() {
             $(doc).mousemove(function(e) {
                 if (dragging) {
                   //  dragBtn.eq(index).prev().text(dragBtn.eq(index).prev().width());
                   //  dragBtn.eq(index).next().text(dragBtn.eq(index).next().width());
                     //----------------------------------------------------------------
                     clickX = e.pageX;
                     if(clickX && clickX <180){
                         clickX = 180;
                     }else if(clickX && clickX >600){
                         clickX = 600;
                     }
                     /**   **/
                     //判断拖动的第几个按钮
                     if (index == 0) {
                         //第一个拖动按钮左边不出界
                         if (clickX > leftOffset) {
                             dragBtn.eq(index).css('left', clickX - 7 - leftOffset + 'px');
                             //按钮移动
                             dragBtn.eq(index).prev().width(clickX - leftOffset + 'px');
                             nextW2 = clickX - leftOffset;
                             dragBtn.eq(index).next().width(wrapWidth - nextW2);
                         } else {
                             dragBtn.eq(index).css('left', '0px');
                         }
                     }
                   
                     if (clickX > (leftOffset + wrapWidth - 5)) {
                         //第一个按钮右边不出界
                         dragBtn.eq(index).css('left', parseFloat((wrapWidth - 11) + 'px'));
                         //第一个按钮，左右容器不出界
                         dragBtn.eq(index).prev().width(dragBtn.eq(index).offset().left - leftOffset + 'px');
                        dragBtn.eq(index).next().width('0px');
                     }
                  
                     contentCSS.setWidth(true,'menuBig',clickX);//设置内容高度
                 }
             });
 
         },
         mouseup: function() {
 //            $(doc).mouseup(function(e) {
 //                dragging = false;
 //            })
 //            $(doc).click(function(e) {
 //                dragging = false;
 //            })
         }
     };
 
 
 app.controller('indexController',['$scope','$rootScope', '$http','$cookieStore','$localStorage','$window','$timeout',function ($scope,$rootScope,$http,$cookieStore,$localStorage,$window,$timeout) {
     
     // 添加监听器
     platform.webSocket.addListener("not_received_message", "onmessage", function(message){
         var messageArray = [];
         var xxList = JSON.parse(message.xxnr);
         for(var i=0;i<xxList.length;i++){
             messageArray.push({
                 xh : xxList[i].messageVO.xh,
                 title : xxList[i].messageVO.xxbt,
                 content : xxList[i].messageVO.xxnr,
                 url : xxList[i].messageVO.lj,
                 time: 20000,
                 callback : function (message) {
                     if (message.url) {
                         if (message.url.indexOf('/') != 0) {
                             message.url = '/' + message.url;
                         }
                         var connector = message.url.indexOf("?") > 0 ? "&" : "?";
                         message.url += connector + "xh=" + message.xh;
                         Common.dialog({
                             type : "open",
                             url : webRoot + message.url,
                             title : "消息详情",
                             width : "100%",
                             height : "100%"
                         });
 //                		$("#boandaContent").attr("src", webRoot + message.url);
                     }
                     TOP_WINDOW.window.currentShowMessageNum--;
                     if(TOP_WINDOW.window.currentShowMessageNum < 0){
                         TOP_WINDOW.window.currentShowMessageNum = 0;
                     }
                     Notifier.element.setNewMessageAction("message", {
                         number : TOP_WINDOW.window.currentShowMessageNum
                     }, false, TOP_WINDOW.window.document);
                     var xxxhs = [];
                     xxxhs.push(message.xh);
                     Common.send($scope, $http, {
                         method: 'POST',
                         url: webRoot + '/platform/message/messagecontroller/readmessage',
                         data: {
                             xxxhs : xxxhs
                         }
                     });
                 }
             })
         }
         Notifier.pushShowMessage.addMessageQueueItem(messageArray);
         var animate = messageArray.length > 0 ? true : false;
         Notifier.element.setNewMessageAction("message", {
             number : message.kzcs
         }, animate, TOP_WINDOW.window.document);
         TOP_WINDOW.window.currentShowMessageNum = message.kzcs;
     });
 
 
     // 添加监听器
     platform.webSocket.addListener("rygx", "onmessage", function(message){
         var messageArray = [];
         messageArray.push({
             xh : message.xh,
             title : message.xxbt,
             content : message.xxnr,
             url : message.lj,
             time: 20000,
             callback : function (message) {
                 if (message.url) {
                     if (message.url.indexOf('/') != 0) {
                         message.url = '/' + message.url;
                     }
                     var connector = message.url.indexOf("?") > 0 ? "&" : "?";
                     message.url += connector + "xh=" + message.xh;
 //            		$("#boandaContent").attr("src", webRoot + message.url);
                     Common.dialog({
                         type : "open",
                         url : webRoot + message.url,
                         title : "消息详情",
                         width : "100%",
                         height : "100%"
                     });
                 }
                 TOP_WINDOW.window.currentShowMessageNum--;
                 if(TOP_WINDOW.window.currentShowMessageNum < 0){
                     TOP_WINDOW.window.currentShowMessageNum = 0;
                 }
                 Notifier.element.setNewMessageAction("message",{
                     number : TOP_WINDOW.window.currentShowMessageNum
                 }, false, TOP_WINDOW.window.document);
                 var xxxhs = [];
                 xxxhs.push(message.xh);
                 Common.send($scope, $http, {
                     method: 'POST',
                     url: webRoot + '/platform/message/messagecontroller/readmessage',
                     data: {
                         xxxhs : xxxhs
                     }
                 });
             }
         })
         Notifier.pushShowMessage.addMessageQueueItem(messageArray);
         TOP_WINDOW.window.currentShowMessageNum++;
         Notifier.element.setNewMessageAction("message",{
             number : TOP_WINDOW.window.currentShowMessageNum
         }, true, TOP_WINDOW.window.document);
     });
     
     
     // 点击铃铛事件
     $scope.clickBell = function($event) {
         $scope.showLeftMenu = false;
         $(".menuContent").hide();
         $scope.isShowBigMenuBox = false;
         contentCSS.setWidth(null);
         $(".selectMenu").removeClass('selectMenu');
         checkIframeScroll("",true);
         $("#boandaContent").attr("src", webRoot + '/platform/message/messagecontroller/usermessage');
         $('.portalDiv').find('.on').removeClass('on');
         $(".portalDiv > p >span:first").addClass('on');
         $('.firstMenu >li').find('a').removeClass('on');
         $('.mession-list >div').find('a').removeClass('on');
         $($event.target).addClass('on');
         $event.stopPropagation($event);
         $event.preventDefault($event);
     };
     
     // 用户名称最多显示5个字符，多了用...代替
     if ($scope.yhmc.length > 5) {
         $scope.yhmc = $scope.yhmc.substring(0, 4) + '...';
     }
 
     $scope.showLeftMenu = false;
     $(".menuContent").hide();
     $scope.isShowBigMenuBox = false;
     $scope.allThemes = [
         {name:'蓝色',value:'default'},
         {name:'红色',value:'red'},
         {name:'黑色',value:'black'}];
     $scope.isSkinActive = false;
     $scope.searchInput = false;
     $scope.isFontActive = false;
     $scope.isMessageActive = false;
     $scope.isSetActive = false;
     $scope.isExitActive = false;
     var isShowHomePage = $('#isShowHomePage').val();
     if(isShowHomePage &&( isShowHomePage == false || isShowHomePage == 'false')){
          $scope.isShowBigMenuBox = true;
     }else{
          $scope.isShowBigMenuBox = false;
     }
    
     $scope.menuUpDownTips = 'show-up';
     $scope.isShowAllFirstMenu = false;
     $scope.isSearchActive = false;
     $scope.clickIndex = '';
     $scope.userSetList = [];
     checkIframeScroll('',true);
     if (!$("#boandaContent").attr("src")) {
         $("#boandaContent").attr("src", $("#defaultIframeURL").val());
         $scope.isShowBigMenuBox = false;//防止外网地址 页面显示不全问题
     }
     // $scope.UserSkin = $cookieStore.get("UserSkin") ? $cookieStore.get("UserSkin") : {};
     $scope.UserSkin = JSON.parse($window.localStorage['UserSkin'] || '{}');
     $scope.skinItem = webRoot+'/resources/platform/index/css/index-default.css';
     if(sessionID && ($scope.UserSkin.sessionID == sessionID)){
         $scope.skinItem = webRoot+'/resources/platform/index/css/index-'+$scope.UserSkin.skinName+'.css';
         var allSkinDiv = $('.skinDiv').find('span');
         allSkinDiv.removeClass('on');
         for(var i=0;i<allSkinDiv.length;i++){
             if($(allSkinDiv[i]).attr('data-value') == $scope.UserSkin.skinName){
                 $('.skinDiv').find('.on').removeClass('on');
                 $(allSkinDiv[i]).addClass('on');
             }
         }
     }
     $scope.changeMenuBox = function (first) {
         if(first == 1 && $scope.isShowBigMenuBox){
             return false;
         }else{
             $scope.isShowBigMenuBox = !$scope.isShowBigMenuBox;
            // $scope.showLeftMenu =  $scope.isShowBigMenuBox;
             var className = $scope.isShowBigMenuBox ? 'menuBig' : 'menuSmall';
             contentCSS.setWidth($scope.showLeftMenu,className);
 //            if($scope.showLeftMenu) {
 //            	$(".menuContent").show();
 //            	$scope.isShowBigMenuBox = true;
 //            } else {
 //            	$(".menuContent").hide();
 //            	$scope.isShowBigMenuBox = false;
 //            }
         }
     };
     $scope.clickMenuSmall = function (item,$event) {
         //切换目录
         $scope.changeMenuBox();
         //打开子节点
         $scope.openChildNode(item);
         
 //        if(item.CDURL){
 //            $scope.openWinLink(item)
 //        }
     };
     $scope.openChildNode = function(item) {
         var list = $scope.allMenuItem.menuSecond;
         for (var i = 0; i < list.length; i++) {
             if(!($scope.allMenuItem.menuSecond[i].CDBH === item.CDBH)){
                 $scope.allMenuItem.menuSecond[i].sign = false;
                 $scope.allMenuItem.menuSecond[i].showicon = 'show-down';
                 
             }else{
                 $scope.allMenuItem.menuSecond[i].sign = true;
                 $scope.allMenuItem.menuSecond[i].showicon = 'show-up';
             }
         }
     };
     $scope.obtainI = function(item) {
         var list = $scope.allMenuItem.menuSecond;
         for (var i = 0; i < list.length; i++) {
             if(list[i].CDBH === item.CDBH){
                 return i;
             }
         }
     };
     
     
     $scope.allMenuItem = {
         menuFirst : [],
         menuSecond : []
     };
     
     var temp = [];
     
     //查询当前用户的菜单
     Common.send($scope, $http, {
         method: "POST",
         url: Common.webRoot() + '/platform/rms/usercontroller/findcurrentusermenu',
         success: function(result){
             var menus = result.data;
             Common.send($scope, $http, {
                 method: "POST",
                 url: Common.webRoot() + '/platform/rms/usercontroller/getsystemroot',
                 success: function(res){
                     //获取系统根
                     var systemRoot = res.data.SYSTEM_ROOT;
                     //一级菜单
                     for(var i=0;i<menus.length;i++){
                         if(menus[i].FCDXH == systemRoot){
                             var menuItem = {CDBH: menus[i].XH,CDMC: menus[i].CDMC,TPLJ: menus[i].TPWZ,CDURL: menus[i].LJDZ,SFXCKDK: menus[i].SFXCKDK,SFWBCD: menus[i].SFWBCD,CDURL:menus[i].LJDZ,SFXSZCCD:menus[i].SFXSZCCD};
                             $scope.allMenuItem.menuFirst.push(menuItem);
                         }else{
                             temp.push(menus[i]);
                         }
                     }
                     //二级菜单
                     for(var i=0;i<temp.length;i++){
                         for(var j=0;j<$scope.allMenuItem.menuFirst.length;j++){
                             if(temp[i].FCDXH == $scope.allMenuItem.menuFirst[j].CDBH){
                                 var menuItem = {CDBH: temp[i].XH,parentbh: temp[i].FCDXH,CDMC: temp[i].CDMC,TPLJ: temp[i].TPWZ?temp[i].TPWZ:"/",CDURL:temp[i].LJDZ, SFXCKDK: temp[i].SFXCKDK, SFWBCD: temp[i].SFWBCD, children:[],sign:true};
                                 $scope.allMenuItem.menuSecond.push(menuItem);
                             }
                         }
                     }
                     //三级菜单
                     for(var i=0;i<temp.length;i++){
                         for(var j=0;j<$scope.allMenuItem.menuSecond.length;j++){
                             if(temp[i].FCDXH == $scope.allMenuItem.menuSecond[j].CDBH){
                                 var menuItem = {CDBH: temp[i].XH,CDMC: temp[i].CDMC,CDURL: temp[i].LJDZ, SFXCKDK: temp[i].SFXCKDK, SFWBCD: temp[i].SFWBCD,sign:true};
                                 $scope.allMenuItem.menuSecond[j].children.push(menuItem);
                                 break;
                             }
                         }
                     }
                 }
             });
         }
     });
     // 更换图标状态（选中，普通）
     $scope.imgSrcDefault = function(event){
         var imgAll = $(event.target).parents('.headerContent');
         imgAll = imgAll.find('img');
         imgAll.each(function(){
             var hasFocu = this.src.indexOf('_focu.png');
             if(hasFocu != -1){
                 var imgSrc = this.src.slice(0, hasFocu);
                 this.src = imgSrc + '.png';
             }
         })
 
         // 更换图标
         var img = $(event.target).parent().find('img');
         var imgSrc = img.attr('src');
         if (imgSrc) {
             var imgSrcNoName = imgSrc.slice(0, imgSrc.lastIndexOf('.'));
             img.attr('src', imgSrcNoName + '_focu.png');
         }
     }
         //  前端控制菜单跳转
         $scope.secondMenuIndex = undefined;
         $scope.thirdMenuIndex = undefined;
         window.ParentFunc = (v1, v2, v3)=>{
            $scope.secondMenuIndex = undefined;
            $scope.thirdMenuIndex = undefined;
            $scope.allMenuItem.menuSecond.forEach((second, i)=>{
                if(second.CDMC == v2){
                    $scope.secondMenuIndex = i;
                }
                second.children.forEach((third, j)=>{
                    if(third.CDMC == v3){
                        $scope.thirdMenuIndex = j;
                    }
                })
            });
            let menuFirst = $scope.allMenuItem.menuFirst.filter(item=>{
                return item.CDMC == v1;
            })[0];
            if(menuFirst){
                let ele = document.getElementById(menuFirst.CDBH);
                ele = $(ele).find('a')[0];
                angular.element(ele).triggerHandler('click');
                $timeout(function() {
                    $scope.secondMenuIndex = undefined;
                    $scope.thirdMenuIndex = undefined;
                }, 10);
            }else{
                console.warn('菜单跳转失败，没有匹配的菜单。');
            }
         }
     //一级菜单打开
     $scope.openMenuCenter = function ($event,item) {
         
         $scope.showLeftMenu = false;
         $(".menuContent").hide();
         $scope.isShowBigMenuBox = false;
         if(item.SFXSZCCD == 0){
             $scope.showLeftMenu = false;
             contentCSS.setWidth(null);
         }else{
             contentCSS.setWidth($scope.showLeftMenu);
         }
         
         $(".selectMenu").removeClass('selectMenu');
         checkIframeScroll("",true);
         $('.portalDiv').find('.on').removeClass('on');
         $($event.target).addClass('on');
         $('.firstMenu >li').find('a').removeClass('on');
         $('.mession-list >div').find('a').removeClass('on');
         $($event.target).parent().find('a').addClass('on');
 
         $('.portalDiv').find('.on').removeClass('on');
         if(item.CDURL){
             $scope.openWinLink(item)
         }
         
         $event.stopPropagation();
         $event.preventDefault();
 
         // 更换图标状态
         $scope.imgSrcDefault($event);
         
         $event.stopPropagation();
         $event.preventDefault();
         //如果是一级菜单调用,且一级菜单存在默认的展示页面,判断是否显示左侧菜单
         if(item.SFXSZCCD == 1){
             $scope.openMenuLeft($event,item,1);
         }
     };
 
     // $scope.ParentFunc=function (v1,v2){
     //     console.log(v1,v2)
     //     // if(v1==='1'){
     //     //     $("#headerNavList").find("a:contains("+v2+")").click()
     //     // }else {
     //     //     $(".munu3").find("span:contains("+v2+")").click()
     //     // }
     // };
 
 
 
     
     $scope.openMenuLeft = function ($event,item,type) {
         console.log($event,'456')
         console.log(item,'789')
         console.log(type,'000')
         var showLeftMenuContent = false;
         $scope.showLeftMenu = item.SFXSZCCD == 0 ? false : true;
         if($scope.showLeftMenu == false){
             showLeftMenuContent = true;
         }
         if(type == 1){
             return
         }
         //此处应不区分true/false
         $scope.showLeftMenu = true;
         $scope.isShowBigMenuBox = true;
 
         contentCSS.setWidth($scope.showLeftMenu);
         if ("5085029842466791424" != item.CDBH && "工作台" != item.CDMC){
             $(".menuContent").show();
             // 更换图标状态
             $scope.imgSrcDefault($event);
             $('.big-menu-box > div').addClass('hide');
             $('.iconMenu').addClass('hide');
             $(".parent_"+item.CDBH).removeClass('hide');
             $('.firstMenu >li').find('a').removeClass('on');
             $('.mession-list >div').find('a').removeClass('on');
             $($event.target).parent().find('a').addClass('on');
             $('.portalDiv').find('.on').removeClass('on');
         }
 
         if(type == 1){
             return
         }
 
         var first = 1;
         $scope.changeMenuBox(first);
         for(var i=0;i<$scope.allMenuItem.menuSecond.length;i++){
             if($scope.allMenuItem.menuSecond[i].parentbh == item.CDBH){
                if($scope.secondMenuIndex && $scope.secondMenuIndex != i){
                    continue;
                }
                 if($scope.allMenuItem.menuSecond[i].children.length){
                     $timeout(function() {
                        let thirdIndex = $scope.thirdMenuIndex || 0;
                         var el = document.getElementById($scope.allMenuItem.menuSecond[i].children[thirdIndex].CDBH);
                         angular.element(el).triggerHandler('click');
                     }, 0);
                 }else {
                     $timeout(function() {
                         var el = document.getElementById($scope.allMenuItem.menuSecond[i].CDBH).children[1];
                         angular.element(el).triggerHandler('click');
                     }, 0);
                 }
                 break;
             }
         }
         $event.stopPropagation();
         $event.preventDefault();
         if(showLeftMenuContent){
             $scope.changeMenuBox();
         }
     };

     $scope.openWinLink = function (menu,$event) {
         //打开子节点
 
         console.log(menu,'123')
         console.log($event,'456')
         $scope.changeMenuUpDown2(menu,$event);
         //保存当前菜单页面的菜单编号
         sessionStorage.setItem("currentMenu", JSON.stringify(menu));
         var link = menu.CDURL;
         if(!menu.CDURL){
             return;
         }
         if(menu.SFWBCD == 0){
             if (link.indexOf('/') != 0) {
                 link = '/' + link;
             }
 
             link = webRoot + link;
             link = Common.link(link);
         }
         if(menu.SFXCKDK == 1){
             window.open(link);
         }else {
             checkIframeScroll(menu);
             $("#boandaContent").attr("src", link);
         }
         
         $(".selectMenu").removeClass('selectMenu');
         if(!menu.children || menu.children.length == 0){
             if($event){
                 $($event.target).addClass('selectMenu');
             }
         }
         var YM = Base64.encode(document.domain);
          
         //添加菜单访问记录到数据库
         Common.send($scope, $http, {
             method: 'POST',
             url: Common.webRoot() + '/platform/rms/menucontroller/addmenuaccess',
             data: JSON.stringify({
                 YM :YM,
                 CDBH : menu.CDBH,
                 CDMC : menu.CDMC,
                 KHDLX : '电脑',
                 XDLJ : menu.CDURL
             })
         });
         
     };
     $scope.changeMenuUpDown = function (item,$event) {
         if(!item.children || !item.children.length){
             $scope.openWinLink(item,$event)
         }
         var list = $scope.allMenuItem.menuSecond;
         for (var i = 0; i < list.length; i++) {
             if(($scope.allMenuItem.menuSecond[i].CDBH === item.CDBH)){
                 if(!$scope.allMenuItem.menuSecond[i].sign && $scope.allMenuItem.menuSecond[i].showicon === 'show-down'){
                 $scope.allMenuItem.menuSecond[i].sign = true;
                 $scope.allMenuItem.menuSecond[i].showicon = 'show-up';
             }else{
                 $scope.allMenuItem.menuSecond[i].sign = false;
                 $scope.allMenuItem.menuSecond[i].showicon = 'show-down';
             }
             return;
             }
         }
     };
     $scope.changeMenuUpDown2 = function (item,$event) {
         var list = $scope.allMenuItem.menuSecond;
         for (var i = 0; i < list.length; i++) {
             if(($scope.allMenuItem.menuSecond[i].CDBH === item.CDBH)){
                 if(!$scope.allMenuItem.menuSecond[i].sign && $scope.allMenuItem.menuSecond[i].showicon === 'show-down'){
                 $scope.allMenuItem.menuSecond[i].sign = true;
                 $scope.allMenuItem.menuSecond[i].showicon = 'show-up';
             }else{
                 $scope.allMenuItem.menuSecond[i].sign = false;
                 $scope.allMenuItem.menuSecond[i].showicon = 'show-down';
             }
             return;
             }
         }
     };
     $scope.showAllMenu = function () {
         $scope.isShowAllFirstMenu = true
     };
     $scope.hideAllMenu = function () {
         $scope.isShowAllFirstMenu = false
     };
     $scope.showHideAllMenu = function () {
         $scope.isShowAllFirstMenu = !$scope.isShowAllFirstMenu;
     };
     $scope.backToIndex = function ($event) {
         $scope.showLeftMenu = false;
         $(".menuContent").hide();
         $scope.isShowBigMenuBox = false;
         contentCSS.setWidth($scope.showLeftMenu);
         $(".selectMenu").removeClass('selectMenu');
         checkIframeScroll("",true);
         $("#boandaContent").attr("src", $("#defaultIframeURL").val());
         $('.portalDiv').find('.on').removeClass('on');
         $(".portalDiv > p >span:first").addClass('on');
         // $('.big-menu-box > div').addClass('hide');
         // $('.iconMenu').addClass('hide');
         $('.firstMenu >li').find('a').removeClass('on');
         $('.mession-list >div').find('a').removeClass('on');
         
         $($event.target).parent().find('a').addClass('on');
         
         // 更换图标
         $scope.imgSrcDefault($event);
 
         // var first = 1;
         // $scope.changeMenuBox(first);
         $event.stopPropagation($event);
         $event.preventDefault($event);
     };
 
     $scope.showTips = function ($event) {
        $($event.target).data('tipIndex', Common.dialog({'type':'tips','content':$($event.target).attr('data-text'),'id':$($event.target).attr('id'),width:'110px',height:'35px'}));
     };
     $scope.hideTips = function ($event) {
         Common.dialog({'type':'close','index':$($event.target).data('tipIndex')});
     };
     $scope.chooseFont = function (font,$event) {
         switch (font){
             case 'big' :
                 $('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontBig');
                 $('#boandaContent').contents().find('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontBig');
                 break;
             case 'default' :
                 $('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontDefault');
                 $('#boandaContent').contents().find('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontDefault');
                 break;
             case 'small' :
                 $('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontSmall');
                 $('#boandaContent').contents().find('html').removeClass('fontDefault').removeClass('fontBig').removeClass('fontSmall').addClass('fontSmall');
                 break;
             default :break;
         }
         $('.fontDiv').find('.on').removeClass('on');
         $($event.target).addClass('on');
         $event.stopPropagation();
         $event.preventDefault();
     };
     $scope.chooseSkin = function (type,$event) {
         var skin = type;
         $('#skinTheme').attr('href',Common.webRoot()+'/resources/platform/index/css/index-'+skin+'.css');
         $('#colorLink').attr('href',webRoot+'/resources/platform/common/css/color-'+skin+'.css');
         $("#boandaContent").contents().find('#colorLink').attr('href',webRoot+'/resources/platform/common/css/color-'+skin+'.css');
         $('.skinDiv').find('.on').removeClass('on');
         $($event.target).addClass('on');
         // $cookieStore.put("UserSkin", {'sessionID':sessionID,'skinName':skin});
         $window.localStorage['UserSkin']=JSON.stringify({'sessionID':sessionID,'skinName':skin});
         //
         // $event.stopPropagation();
         // $event.preventDefault();
     };
     $scope.choosePortal = function (portal, $event) {
         $scope.showLeftMenu = false;
         $(".menuContent").hide();
         $scope.isShowBigMenuBox = false;
         contentCSS.setWidth($scope.showLeftMenu);
         $(".selectMenu").removeClass('selectMenu');
         var param = "?portalId=" + portal.value;
         checkIframeScroll("",true);
         $("#boandaContent").attr("src", $("#defaultIframeURL").val() + param);
         $('.portalDiv').find('.on').removeClass('on');
         $($event.target).addClass('on');
         $('.firstMenu >li').find('a').removeClass('on');
         $('.mession-list >div').find('a').removeClass('on');
         $('.firstMenu >li >span >a:first').addClass('on');
         $event.stopPropagation();
         $event.preventDefault();
     };
     $scope.openUserSet = function () {
         Common.dialog({
             type : 'open',
             title : '个人信息设置',
             url : webRoot+'/platform/rms/usercontroller/userset',
             width : '900px',
             height : '480px'
         })
     };
     $scope.openSearch = function () {
         $scope.searchInput = !$scope.searchInput
     };
     $scope.openQuitConfirm = function () {
         Common.dialog({
             type : 'confirm',
             content : '确认退出吗？',
             title : '退出',
             callback: function () {
                 $scope.user = $localStorage.getObject("userInfo") ? $localStorage.getObject("userInfo") : {};
                 $localStorage.setObject("userInfo", {'XTZH':$scope.user.XTZH,'YHPD':'','remember':$scope.user.remember});
                 window.location.href = webRoot +'/loginout?token=' + sessionStorage.getItem('token');
             },
             error: function () {
                 return false
             }
         })
     };
     $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
         $('.firstMenu >li:eq(0)').find('a').addClass('on');
         var id = $('.firstMenu >li:eq(0)').attr('id');
         if(id){
             $('.parent_'+id).removeClass('hide');
         }
     });
     $(window).resize(function() {
         contentCSS.setHeight();
         var className = $scope.isShowBigMenuBox ? 'menuBig' : 'menuSmall';
         contentCSS.setWidth($scope.showLeftMenu,className);
         if($scope.showLeftMenu) {
             $(".menuContent").show();
             $scope.isShowBigMenuBox = true;
         } else {
             $(".menuContent").hide();
             $scope.isShowBigMenuBox = false;
         }
     });
     
     if($("#defaultIframeURL").val().indexOf('/platform/home/homecontroller/portalhomepage') > -1){
         Common.send($scope, $http, {
             method : "POST",
             url : Common.webRoot() + "/platform/system/portal/portalmanagement/portalcontroller/finduserportal",
             success : function(result){
                 var portals = result.data;
                 $scope.allPortals = [];
                 if(portals){
                     for(var portal in portals){
                         var portalInfo = portal.split("_");
                         var obj = {name : portalInfo[1], value : portalInfo[0]};
                         $scope.allPortals.push(obj);
                     }
                 }
                 if($scope.allPortals.length > 1) {
                     $scope.isShowList = true;
                 }else {
                     $scope.isShowList = false;
                 }
             }
         });
     };
     if(userSet && userSet.list && userSet.list.length){
         $scope.userSetList = userSet.list;
     }
     $scope.clickUserSetList = function (item,event) {
       
         if(item){
             var contentUrl = item.url;
             if(contentUrl && contentUrl.indexOf('http')==0){
                 //do nothing
             }else if(contentUrl){
                 contentUrl = Common.webRoot() + contentUrl;
             }
             switch (item.type){
                 case  "1" :
                     var contentWidth = item.property.width ? item.property.width : "60%";
                     var contentHeight = item.property.height ? item.property.height : "60%";
                     var contentTitle = item.property.title ? item.property.title : item.name;
                     Common.dialog({
                         type : 'open',
                         title : contentTitle,
                         url : contentUrl,
                         width : '900px',
                         height : '480px'
                     });
                     break;
                 case "0" :
                     $scope.showLeftMenu = false;
                     $(".menuContent").hide();
                     $scope.isShowBigMenuBox = false;
                     contentCSS.setWidth();
                     $(".selectMenu").removeClass('selectMenu');
                     checkIframeScroll("",true);
                     $("#boandaContent").attr("src", contentUrl);
                     $('.firstMenu >li').find('a').removeClass('on');
                     $('.mession-list >div').find('a').removeClass('on');
                     event.stopPropagation(event);
                     break;
             }
         }
         /*
         * 为解决angularjs与layer.js之间的不兼容，必须加上阻止时间冒泡，否则打开的窗口无法关闭。
         * */
         event.stopPropagation();
     }
     
 }]);
 app.factory('$localStorage', [ '$window', function($window) {
     return { //存储单个属性
         set : function(key, value) {
             $window.localStorage[key] = value;
         }, //读取单个属性
         get : function(key, defaultValue) {
             return $window.localStorage[key] || defaultValue;
         }, //存储对象，以JSON格式存储
         setObject : function(key, value) {
             $window.localStorage[key] = JSON.stringify(value);
         }, //读取对象
         getObject : function(key) {
             return JSON.parse($window.localStorage[key] || '{}');
         }
     }
 } ]);
 $(function () {
     contentCSS.init();
   //没有首页的情况下默认显示第一个菜单
     setTimeout(clickFirstMenu,150);
 
    DragChangeSize.init();
     
 });
 
 function checkIframeScroll(menuItem,bool) {
     if(bool){
         $("#boandaContent").attr("scrolling","no");
         return false;
     }
     if(menuItem.SFWBCD){
         $("#boandaContent").attr("scrolling","auto");
     }else {
         $("#boandaContent").attr("scrolling","no");
     }
 }
 //没有首页的情况下默认显示第一个菜单
 function clickFirstMenu (){
     var isShowHomePage = $('#isShowHomePage').val();
     if(isShowHomePage &&( isShowHomePage == false || isShowHomePage == 'false')){
             $('.firstMenu li div:first').click();
     }
      
 }
 
 // function ParentFunc(v1,v2){
 //     console.log(v1,v2)
 //     if(v1==='1'){
 //         $(".ng-scope").find("a:contains("+v2+")").click()
 //     }else {
 //         $(".menu-title").find("span:contains("+v2+")").click()
 //     }
 //     debugger
 // }
 
 function ParentFunc(v1,v2){
     console.log(v1,v2)
     let ele;
     if(v1==='1'){
         ele = $('#indexPage .firstMenu .ng-scope').find('a:contains('+ v2 +')')[0];
         angular.element(ele).triggerHandler('click');
         // $(".ng-scope").find("a:contains("+v2+")").click()
     }else {
         ele = $('.menu-title .ng-binding:contains('+ v2 +')')[0] || $('.menu-item .ng-binding:contains('+ v2 +')')[0];
         angular.element(ele).triggerHandler('click');
         // $(".menu-title").find("span:contains("+v2+")").click()
     }
     // debugger
 }
 