/*! AdminLTE app.js
 * ================
 * Main JS application file for AdminLTE v2. This file
 * should be included in all pages. It controls some layout
 * options and implements exclusive AdminLTE plugins.
 *
 * @Author  Almsaeed Studio
 * @Support <http://www.almsaeedstudio.com>
 * @Email   <support@almsaeedstudio.com>
 * @version 2.3.0
 * @license MIT <http://opensource.org/licenses/MIT>
 */

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
    throw new Error("AdminLTE requires jQuery");
}

/* AdminLTE
 *
 * @type Object
 * @description $.AdminLTE is the main object for the template's app.
 *              It's used for implementing functions and options related
 *              to the template. Keeping everything wrapped in an object
 *              prevents conflict with other plugins and is a better
 *              way to organize our code.
 */
$.AdminLTE = {};

/* --------------------
 * - AdminLTE Options -
 * --------------------
 * Modify these options to suit your implementation
 */
$.AdminLTE.options = {
    //Add slimscroll to navbar menus
    //This requires you to load the slimscroll plugin
    //in every page before app.js
    navbarMenuSlimscroll: true,
    navbarMenuSlimscrollWidth: "3px", //The width of the scroll bar
    navbarMenuHeight: "200px", //The height of the inner menu
    //General animation speed for JS animated elements such as box collapse/expand and
    //sidebar treeview slide up/down. This options accepts an integer as milliseconds,
    //'fast', 'normal', or 'slow'
    animationSpeed: 500,
    //Sidebar push menu toggle button selector
    sidebarToggleSelector: "[data-toggle='offcanvas']",
    //Activate sidebar push menu
    sidebarPushMenu: true,
    //Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
    sidebarSlimScroll: true,
    //Enable sidebar expand on hover effect for sidebar mini
    //This option is forced to true if both the fixed layout and sidebar mini
    //are used together
    sidebarExpandOnHover: false,
    //BoxRefresh Plugin
    enableBoxRefresh: true,
    //Bootstrap.js tooltip
    enableBSToppltip: true,
    BSTooltipSelector: "[data-toggle='tooltip']",
    //Enable Fast Click. Fastclick.js creates a more
    //native touch experience with touch devices. If you
    //choose to enable the plugin, make sure you load the script
    //before AdminLTE's app.js
    enableFastclick: true,
    //Control Sidebar Options
    enableControlSidebar: true,
    controlSidebarOptions: {
        //Which button should trigger the open/close event
        toggleBtnSelector: "[data-toggle='control-sidebar']",
        //The sidebar selector
        selector: ".control-sidebar",
        //Enable slide over content
        slide: true
    },
    //Box Widget Plugin. Enable this plugin
    //to allow boxes to be collapsed and/or removed
    enableBoxWidget: true,
    //Box Widget plugin options
    boxWidgetOptions: {
        boxWidgetIcons: {
            //Collapse icon
            collapse: 'fa-minus',
            //Open icon
            open: 'fa-plus',
            //Remove icon
            remove: 'fa-times'
        },
        boxWidgetSelectors: {
            //Remove button selector
            remove: '[data-widget="remove"]',
            //Collapse button selector
            collapse: '[data-widget="collapse"]',
            // add full screen
            fscreen:'[data-widget="fscreen"]'
        }
    },
    //Direct Chat plugin options
    directChat: {
        //Enable direct chat by default
        enable: true,
        //The button to open and close the chat contacts pane
        contactToggleSelector: '[data-widget="chat-pane-toggle"]'
    },
    //Define the set of colors to use globally around the website
    colors: {
        lightBlue: "#3c8dbc",
        red: "#f56954",
        green: "#00a65a",
        aqua: "#00c0ef",
        yellow: "#f39c12",
        blue: "#0073b7",
        navy: "#001F3F",
        teal: "#39CCCC",
        olive: "#3D9970",
        lime: "#01FF70",
        orange: "#FF851B",
        fuchsia: "#F012BE",
        purple: "#8E24AA",
        maroon: "#D81B60",
        black: "#222222",
        gray: "#d2d6de"
    },
    //The standard screen sizes that bootstrap uses.
    //If you change these in the variables.less file, change
    //them here too.
    screenSizes: {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200
    }
};

/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements AdminLTE's
 * functions and plugins as specified by the
 * options above.
 */
$(function () {
    "use strict";

    //Fix for IE page transitions
    $("body").removeClass("hold-transition");

    //Extend options if external options exist
    if (typeof AdminLTEOptions !== "undefined") {
        $.extend(true,
            $.AdminLTE.options,
            AdminLTEOptions);
    }

    //Easy access to options
    var o = $.AdminLTE.options;

    //Set up the object
    _init();

    //Activate the layout maker
    $.AdminLTE.layout.activate();

    //Enable sidebar tree view controls
    $.AdminLTE.tree('.sidebar');

    //Enable control sidebar
    if (o.enableControlSidebar) {
        $.AdminLTE.controlSidebar.activate();
    }

    //Add slimscroll to navbar dropdown
    if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
        $(".navbar .menu").slimscroll({
            height: o.navbarMenuHeight,
            alwaysVisible: false,
            size: o.navbarMenuSlimscrollWidth
        }).css("width", "100%");
    }

    //Activate sidebar push menu
    if (o.sidebarPushMenu) {
        $.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
    }

    //Activate Bootstrap tooltip
    if (o.enableBSToppltip) {
        $('body').tooltip({
            selector: o.BSTooltipSelector
        });
    }

    //Activate box widget
    if (o.enableBoxWidget) {
        $.AdminLTE.boxWidget.activate();
    }

    //Activate fast click
    if (o.enableFastclick && typeof FastClick != 'undefined') {
        FastClick.attach(document.body);
    }

    //Activate direct chat widget
    if (o.directChat.enable) {
        $(document).on('click', o.directChat.contactToggleSelector, function () {
            var box = $(this).parents('.direct-chat').first();
            box.toggleClass('direct-chat-contacts-open');
        });
    }

    /*
     * INITIALIZE BUTTON TOGGLE
     * ------------------------
     */
    $('.btn-group[data-toggle="btn-toggle"]').each(function () {
        var group = $(this);
        $(this).find(".btn").on('click', function (e) {
            group.find(".btn.active").removeClass("active");
            $(this).addClass("active");
            e.preventDefault();
        });

    });
});

/* ----------------------------------
 * - Initialize the AdminLTE Object -
 * ----------------------------------
 * All AdminLTE functions are implemented below.
 */
function _init() {
    'use strict';
    /* Layout
     * ======
     * Fixes the layout height in case min-height fails.
     *
     * @type Object
     * @usage $.AdminLTE.layout.activate()
     *        $.AdminLTE.layout.fix()
     *        $.AdminLTE.layout.fixSidebar()
     */
    $.AdminLTE.layout = {
        activate: function () {
            var _this = this;
            _this.fix();
            _this.fixSidebar();
            $(window, ".wrapper").resize(function () {
                _this.fix();
                _this.fixSidebar();
            });
        },
        fix: function () {
            //Get window height and the wrapper height
            var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
            var window_height = $(window).height();
            var sidebar_height = $(".sidebar").height();
            //Set the min-height of the content and sidebar based on the
            //the height of the document.
            if ($("body").hasClass("fixed")) {
                $(".content-wrapper, .right-side").css('min-height', window_height - $('.main-footer').outerHeight());
            } else {
                var postSetWidth;
                if (window_height >= sidebar_height) {
                    $(".content-wrapper, .right-side").css('min-height', window_height - neg);
                    postSetWidth = window_height - neg;
                } else {
                    $(".content-wrapper, .right-side").css('min-height', sidebar_height);
                    postSetWidth = sidebar_height;
                }

                //Fix for the control sidebar height
                var controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
                if (typeof controlSidebar !== "undefined") {
                    if (controlSidebar.height() > postSetWidth)
                        $(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
                }

            }
        },
        fixSidebar: function () {
            //Make sure the body tag has the .fixed class
            if (!$("body").hasClass("fixed")) {
                if (typeof $.fn.slimScroll != 'undefined') {
                    $(".sidebar").slimScroll({destroy: true}).height("auto");
                }
                return;
            } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
                window.console.error("Error: the fixed layout requires the slimscroll plugin!");
            }
            //Enable slimscroll for fixed layout
            if ($.AdminLTE.options.sidebarSlimScroll) {
                if (typeof $.fn.slimScroll != 'undefined') {
                    //Destroy if it exists
                    $(".sidebar").slimScroll({destroy: true}).height("auto");
                    //Add slimscroll
                    $(".sidebar").slimscroll({
                        height: ($(window).height() - $(".main-header").height()) + "px",
                        color: "rgba(0,0,0,0.2)",
                        size: "3px"
                    });
                }
            }
        }
    };

    /* PushMenu()
     * ==========
     * Adds the push menu functionality to the sidebar.
     *
     * @type Function
     * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
     */
    $.AdminLTE.pushMenu = {
        activate: function (toggleBtn) {
            //Get the screen sizes
            var screenSizes = $.AdminLTE.options.screenSizes;

            //Enable sidebar toggle
            $(toggleBtn).on('click', function (e) {
                e.preventDefault();

                //Enable sidebar push menu
                if ($(window).width() > (screenSizes.sm - 1)) {
                    if ($("body").hasClass('sidebar-collapse')) {
                        $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
                        cookie.set("winning_sider", "1", 1800);
                        setTimeout(function () {
                            $(window).resize();
                        }, 500)
                    } else {
                        $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
                        cookie.set("winning_sider", "0", 1800);
                        setTimeout(function () {
                            $(window).resize();
                        }, 500);
                    }
                }
                //Handle sidebar push menu for small screens
                else {
                    if ($("body").hasClass('sidebar-open')) {
                        $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
                        setTimeout(function () {
                            $(window).resize();
                        }, 1000)
                    } else {
                        $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
                        setTimeout(function () {
                            $(window).resize();
                        }, 1000)
                    }
                }
            });

            $(".content-wrapper").click(function () {
                //Enable hide menu when clicking on the content-wrapper on small screens
                if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                    $("body").removeClass('sidebar-open');
                }
            });

            //Enable expand on hover for sidebar mini
            if ($.AdminLTE.options.sidebarExpandOnHover
                || ($('body').hasClass('fixed')
                && $('body').hasClass('sidebar-mini'))) {
                this.expandOnHover();
            }
        },
        expandOnHover: function () {
            var _this = this;
            var screenWidth = $.AdminLTE.options.screenSizes.sm - 1;
            //Expand sidebar on hover
            $('.main-sidebar').hover(function () {
                if ($('body').hasClass('sidebar-mini')
                    && $("body").hasClass('sidebar-collapse')
                    && $(window).width() > screenWidth) {
                    _this.expand();
                }
            }, function () {
                if ($('body').hasClass('sidebar-mini')
                    && $('body').hasClass('sidebar-expanded-on-hover')
                    && $(window).width() > screenWidth) {
                    _this.collapse();
                }
            });
        },
        expand: function () {
            $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
        },
        collapse: function () {
            if ($('body').hasClass('sidebar-expanded-on-hover')) {
                $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
            }
        }
    };

    /* Tree()
     * ======
     * Converts the sidebar into a multilevel
     * tree view menu.
     *
     * @type Function
     * @Usage: $.AdminLTE.tree('.sidebar')
     */
    $.AdminLTE.tree = function (menu) {
        var _this = this;
        var animationSpeed = $.AdminLTE.options.animationSpeed;
        /*-----------------------------------------------------------*/
        //菜单的切换 图片切换
        var imgCdHover = function (object) {
            var $this = $(object);
            var checkElement = $this.next();
            //白色主题触发事件加样式
            if ($this.parent('li').is('.treeview')) {    //是否一级菜单
                var $parentElement = $this.parent('li');  //父节点
                //清空同辈元素的菜单图片
                $.each($parentElement.siblings(), function (index, obj) {
                    var $imgElement = $(obj).find("a").find('img').first();
                    var thidcd = $imgElement.attr("thidcd");
                    $imgElement.attr('src', returnImgHoverSrc(thidcd));
                });
                if (isWhiteTm == 1) {
                    //清空同辈元素的菜单效果
                    $parentElement.siblings().find('ul').find('li').first().find('a').first().removeClass('treeview-top-img');
                    $parentElement.siblings().find('div[class="treeview-bottom-img"]').remove();
                    var $imgElement = $this.find('img').first();
                    if (!$parentElement.hasClass('active')) {  //打开
                        //点击一级菜单 切换菜单图片
                        var thidcd = $imgElement.attr("thidcd");
                        $imgElement.attr('src', returnImgActiveSrc(thidcd));
                        //一级菜单添加两个背景图片
                        checkElement.find('li').first().find('a').first().addClass('treeview-top-img');
                        var aimgHtml = '<div class="treeview-bottom-img" id="bgImgDiv" style="display:block;height:10px;width:200px;border:0"></div>';
                        $("#bgImgDiv").remove();
                        checkElement.append(aimgHtml);
                    } else { //一级菜单关闭
                        //点击一级菜单 切换菜单图片
                        var thidcd = $imgElement.attr("thidcd");
                        $imgElement.attr('src', returnImgHoverSrc(thidcd));
                        //一级菜单去除两个背景图片
                        checkElement.find('li').first().find('a').first().removeClass('treeview-top-img'); //
                        $this.parent('li').find('div[class="treeview-bottom-img"]').remove();
                    }
                } else {
                    var $imgElement = $this.find('img').first();
                    if (!$parentElement.hasClass('active')) {
                        //点击一级菜单 切换菜单图片
                        var thidcd = $imgElement.attr("thidcd");
                        $imgElement.attr('src', returnImgActiveSrc(thidcd));
                    } else { //一级菜单关闭
                        //点击一级菜单 切换菜单图片
                        var thidcd = $imgElement.attr("thidcd");
                        $imgElement.attr('src', returnImgHoverSrc(thidcd));
                    }
                }
            }
        };
        /*-----------------------------------------------------------*/
        $(document).on('click', menu + ' li a', function (e) {
            //Get the clicked link and the next element
            var $this = $(this);
            var checkElement = $this.next();
            imgCdHover($this);
            //Check if the next element is a menu and is visible
            if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
                //Close the menu
                checkElement.slideUp(animationSpeed, function () {
                    checkElement.removeClass('menu-open');
                    //Fix the layout in case the sidebar stretches over the height of the window
                    //_this.layout.fix();
                });
                checkElement.parent("li").removeClass("active");
            }
            //If the menu is not visible
            else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                //Get the parent menu
                var parent = $this.parents('ul').first();
                //Close all open menus within the parent
                var ul = parent.find('ul:visible').slideUp(animationSpeed);
                //Remove the menu-open class from the parent
                ul.removeClass('menu-open');
                //Get the parent li
                var parent_li = $this.parent("li");

                //Open the target menu and add the menu-open class
                checkElement.slideDown(animationSpeed, function () {
                    //Add the class active to the parent li
                    checkElement.addClass('menu-open');
                    parent.find('li.active').removeClass('active');
                    parent_li.addClass('active');
                    //菜单展开 图片变为选中
                    if (isWhiteTm == 1) {
                        if (!$this.parent('li').is('.treeview')) {
                            var $imgElement = $this.children('img');
                            $imgElement.attr('src', setImgActiveSrc($imgElement.attr('thidcd')));
                        } else {
                            var $imgElement = $this.children('img');
                            $imgElement.attr('src', returnImgActiveSrc($imgElement.attr('thidcd')));
                        }
                    } else {
                        if ($this.parent('li').is('.treeview')) {
                            var $imgElement = $this.children('img');
                            $imgElement.attr('src', returnImgActiveSrc($imgElement.attr('thidcd')));
                        }
                    }
                    //Fix the layout in case the sidebar stretches over the height of the window
                    _this.layout.fix();
                });
            }
            //if this isn't a link, prevent the page from being redirected
            if (checkElement.is('.treeview-menu')) {
                e.preventDefault();
            }
        });
        /*****************菜单滑动切换图片开始****************/
        $(menu + ' li a').hover(function (e) {
            /* Stuff to do when the mouse enters the element */
            var $this = $(this);
            var $imgElement = $this.children('img');
            var thidcd = $imgElement.attr('thidcd');
            if (isWhiteTm == 1) {
                if (!$this.parent('li').is('.active')) {
                    if (!$this.parent('li').is('.treeview')) {
                        $imgElement.attr('src', setImgActiveSrc(thidcd));
                    } else {
                        $imgElement.attr('src', returnImgActiveSrc($imgElement.attr('thidcd')));
                    }

                }
            } else {
                if ($this.parent('li').is('.treeview')) {
                    $imgElement.attr('src', returnImgActiveSrc($imgElement.attr('thidcd')));
                }
            }
        }, function () {
            /* Stuff to do when the mouse leaves the element */
            var $this = $(this);
            var $imgElement = $this.children('img');
            var thidcd = $imgElement.attr('thidcd');
            if (isWhiteTm == 1) {
                if (!$this.parent('li').is('.active')) {
                    if (!$this.parent('li').is('.treeview')) {
                        $imgElement.attr('src', setImgHoverSrc(thidcd));
                    } else {
                        $imgElement.attr('src', returnImgHoverSrc($imgElement.attr('thidcd')));
                    }
                }
            } else {
                if ($this.parent('li').is('.treeview')) {
                    if (!$this.parent('li').is('.active')) {
                        $imgElement.attr('src', returnImgHoverSrc($imgElement.attr('thidcd')));
                    }
                }
            }

        });
        /*****************菜单滑动切换图片结束****************/

    };

    /* ControlSidebar
     * ==============
     * Adds functionality to the right sidebar
     *
     * @type Object
     * @usage $.AdminLTE.controlSidebar.activate(options)
     */
    $.AdminLTE.controlSidebar = {
        //instantiate the object
        activate: function () {
            //Get the object
            var _this = this;
            //Update options
            var o = $.AdminLTE.options.controlSidebarOptions;
            //Get the sidebar
            var sidebar = $(o.selector);
            //The toggle button
            var btn = $(o.toggleBtnSelector);

            //Listen to the click event
            btn.on('click', function (e) {
                e.preventDefault();
                //If the sidebar is not open
                if (!sidebar.hasClass('control-sidebar-open')
                    && !$('body').hasClass('control-sidebar-open')) {
                    //Open the sidebar
                    _this.open(sidebar, o.slide);
                } else {
                    _this.close(sidebar, o.slide);
                }
            });

            //If the body has a boxed layout, fix the sidebar bg position
            var bg = $(".control-sidebar-bg");
            _this._fix(bg);

            //If the body has a fixed layout, make the control sidebar fixed
            if ($('body').hasClass('fixed')) {
                _this._fixForFixed(sidebar);
            } else {
                //If the content height is less than the sidebar's height, force max height
                if ($('.content-wrapper, .right-side').height() < sidebar.height()) {
                    _this._fixForContent(sidebar);
                }
            }
        },
        //Open the control sidebar
        open: function (sidebar, slide) {
            //Slide over content
            if (slide) {
                sidebar.addClass('control-sidebar-open');
            } else {
                //Push the content by adding the open class to the body instead
                //of the sidebar itself
                $('body').addClass('control-sidebar-open');
            }
        },
        //Close the control sidebar
        close: function (sidebar, slide) {
            if (slide) {
                sidebar.removeClass('control-sidebar-open');
            } else {
                $('body').removeClass('control-sidebar-open');
            }
        },
        _fix: function (sidebar) {
            var _this = this;
            if ($("body").hasClass('layout-boxed')) {
                sidebar.css('position', 'absolute');
                sidebar.height($(".wrapper").height());
                $(window).resize(function () {
                    _this._fix(sidebar);
                });
            } else {
                sidebar.css({
                    'position': 'fixed',
                    'height': 'auto'
                });
            }
        },
        _fixForFixed: function (sidebar) {
            sidebar.css({
                'position': 'fixed',
                'max-height': '100%',
                'overflow': 'auto',
                'padding-bottom': '50px'
            });
        },
        _fixForContent: function (sidebar) {
            $(".content-wrapper, .right-side").css('min-height', sidebar.height());
        }
    };

    /* BoxWidget
     * =========
     * BoxWidget is a plugin to handle collapsing and
     * removing boxes from the screen.
     *
     * @type Object
     * @usage $.AdminLTE.boxWidget.activate()
     *        Set all your options in the main $.AdminLTE.options object
     */
    $.AdminLTE.boxWidget = {
        selectors: $.AdminLTE.options.boxWidgetOptions.boxWidgetSelectors,
        icons: $.AdminLTE.options.boxWidgetOptions.boxWidgetIcons,
        animationSpeed: $.AdminLTE.options.animationSpeed,
        activate: function (_box) {
            var _this = this;
            if (!_box) {
                _box = document; // activate all boxes per default
            }
            //Listen for collapse event triggers
            $(_box).on('click', _this.selectors.collapse, function (e) {
                e.preventDefault();
                _this.collapse($(this));
            });

            //Listen for remove event triggers
            $(_box).on('click', _this.selectors.remove, function (e) {
                e.preventDefault();
                _this.remove($(this));
            });

            //Listen for full screen event
            $(_box).on('click',_this.selectors.fscreen,function (e) {
                //e.preventDefault();
                _this.fscreen($(this));
            })
        },
        fscreen:function(element){
            //Find the box parent
            var body = $('body');
            var box = element.parents(".box").first();

            var button = element.find('i');
            button.toggleClass('fa-expand').toggleClass('fa-compress');
            box.toggleClass('expanded');

            body.toggleClass('body-expanded');
            var timeout = 0;
            if (body.hasClass('body-expanded')) {
                timeout = 100;
            }
            setTimeout(function () {
                box.toggleClass('expanded-padding');
            }, timeout);
            setTimeout(function () {
                box.resize();
            }, timeout + 50);
            
            // var el = box.parent()[0];
            //
            // //防止放大后 再次点击
            // if(el.getAttribute("id") == 'fscreenDiv'){
            //     return ;
            // }
            //
            // //将id和样式写入cookie
            // el.setAttribute("id","fscreenDiv");
            // var divClass = el.getAttribute("class");
            // var divHeight = el.offsetHeight;
            // var fHeight = window.screen.height;
            // cookie.set("fscreenClass",divClass);
            // cookie.set("fscreenHeight",divHeight);
            //
            // //设置全屏时候的样式
            // el.setAttribute("class","col-md-12");
            // el.style.height=fHeight+"px";
            // var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
            // if (typeof rfs != "undefined" && rfs) {
            //     rfs.call(el);
            // } else if (typeof window.ActiveXObject != "undefined") {
            //     // for Internet Explorer
            //     var wscript = new ActiveXObject("WScript.Shell");
            //     if (wscript != null) {
            //         wscript.SendKeys("{F11}");
            //     }
            // }

        },
        collapse: function (element) {
            var _this = this;
            //Find the box parent
            var box = element.parents(".box").first();
            //Find the body and the footer
            var box_content = box.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
            if (!box.hasClass("collapsed-box")) {
                //Convert minus into plus
                element.children(":first")
                    .removeClass(_this.icons.collapse)
                    .addClass(_this.icons.open);
                //Hide the content
                box_content.slideUp(_this.animationSpeed, function () {
                    box.addClass("collapsed-box");
                });
            } else {
                //Convert plus into minus
                element.children(":first")
                    .removeClass(_this.icons.open)
                    .addClass(_this.icons.collapse);
                //Show the content
                box_content.slideDown(_this.animationSpeed, function () {
                    box.removeClass("collapsed-box");
                });
            }
        },
        remove: function (element) {
            //Find the box parent
            var box = element.parents(".box").first();
            box.slideUp(this.animationSpeed);
        }
    };
}

/* ------------------
 * - Custom Plugins -
 * ------------------
 * All custom plugins are defined below.
 */

/*
 * BOX REFRESH BUTTON
 * ------------------
 * This is a custom plugin to use with the component BOX. It allows you to add
 * a refresh button to the box. It converts the box's state to a loading state.
 *
 * @type plugin
 * @usage $("#box-widget").boxRefresh( options );
 */
(function ($) {

    "use strict";

    $.fn.boxRefresh = function (options) {

        // Render options
        var settings = $.extend({
            //Refresh button selector
            trigger: ".refresh-btn",
            //File source to be loaded (e.g: ajax/src.php)
            source: "",
            //Callbacks
            onLoadStart: function (box) {
                return box;
            }, //Right after the button has been clicked
            onLoadDone: function (box) {
                return box;
            } //When the source has been loaded

        }, options);

        //The overlay
        var overlay = $('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');

        return this.each(function () {
            //if a source is specified
            if (settings.source === "") {
                if (window.console) {
                    window.console.log("Please specify a source first - boxRefresh()");
                }
                return;
            }
            //the box
            var box = $(this);
            //the button
            var rBtn = box.find(settings.trigger).first();

            //On trigger click
            rBtn.on('click', function (e) {
                e.preventDefault();
                //Add loading overlay
                start(box);

                //Perform ajax call
                box.find(".box-body").load(settings.source, function () {
                    done(box);
                });
            });
        });

        function start(box) {
            //Add overlay and loading img
            box.append(overlay);

            settings.onLoadStart.call(box);
        }

        function done(box) {
            //Remove overlay and loading img
            box.find(overlay).remove();

            settings.onLoadDone.call(box);
        }

    };

})(jQuery);

/*
 * EXPLICIT BOX ACTIVATION
 * -----------------------
 * This is a custom plugin to use with the component BOX. It allows you to activate
 * a box inserted in the DOM after the app.js was loaded.
 *
 * @type plugin
 * @usage $("#box-widget").activateBox();
 */
(function ($) {

    'use strict';

    $.fn.activateBox = function () {
        $.AdminLTE.boxWidget.activate(this);
    };

})(jQuery);

/*
 * TODO LIST CUSTOM PLUGIN
 * -----------------------
 * This plugin depends on iCheck plugin for checkbox and radio inputs
 *
 * @type plugin
 * @usage $("#todo-widget").todolist( options );
 */
(function ($) {

    'use strict';

    $.fn.todolist = function (options) {
        // Render options
        var settings = $.extend({
            //When the user checks the input
            onCheck: function (ele) {
                return ele;
            },
            //When the user unchecks the input
            onUncheck: function (ele) {
                return ele;
            }
        }, options);

        return this.each(function () {

            if (typeof $.fn.iCheck != 'undefined') {
                $('input', this).on('ifChecked', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    settings.onCheck.call(ele);
                });

                $('input', this).on('ifUnchecked', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    settings.onUncheck.call(ele);
                });
            } else {
                $('input', this).on('change', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    if ($('input', ele).is(":checked")) {
                        settings.onCheck.call(ele);
                    } else {
                        settings.onUncheck.call(ele);
                    }
                });
            }
        });
    };
}(jQuery));


//---------------------------菜单权限开始-------------------------------------------------------------------------------------------------
var isWhiteTm = 1;
; //主题 0 == 黑色主题   白色主题 == 1
if (typeof (isWhiteTm) == "undefined" || isWhiteTm == null) {
    isWhiteTm = 1;
    localStorage.setItem('isWhiteTm', isWhiteTm);
    $('head > link[id = "whiteCss"]').attr('href', baseURL + '/asserts/css/common-white-style.css');
} else if (isWhiteTm == 1) {
    $('head > link[id = "whiteCss"]').attr('href', baseURL + '/asserts/css/common-white-style.css');
} else {
    $('head > link[id = "whiteCss"]').attr('href', '');
}
//alert(isWhiteTm);
var returnImgHoverSrc = function (cddm) {   //一级菜单图片
    if (isWhiteTm == 0) {
        return baseURL + 'asserts/images/menus/black/icon_' + cddm + '_hover.png';
    } else {
        return baseURL + 'asserts/images/menus/white/icon_' + cddm + '_hover.png';
    }
};
var returnImgActiveSrc = function (cddm) {   //一级菜单图片
    if (isWhiteTm == 0) {
        return baseURL + 'asserts/images/menus/black/icon_' + cddm + '_active.png';
    } else {
        return baseURL + 'asserts/images/menus/white/icon_' + cddm + '_active.png';
    }
};
var setImgSrc = function (inx, obj) {   //一级菜单以外的菜单图片 2为二级菜单 3为三级菜单
    if (isWhiteTm == 0) {   //黑色主题
        return '<i class="fa fa-circle-o"></i>' + obj.cdmc;
    } else {
        if (inx == 2) {
            return '<img src="' + baseURL + 'asserts/images/menus/icon_cd_two_hover.png" class="left_menu_14" thidcd="icon_cd_two" onerror="imgError(this)" /><span>' + obj.cdmc + '</span>';
        } else {
            return '<img src="' + baseURL + 'asserts/images/menus/icon_cd_three_hover.png" class="left_menu_14" thidcd="icon_cd_three" onerror="imgError(this)" /><span>' + obj.cdmc + '</span>';
        }
    }
};
var setImgActiveSrc = function (thidcd) {   //一级菜单以外的菜单图片 2为二级菜单 3为三级菜单
    return baseURL + 'asserts/images/menus/' + thidcd + '_active.png';
};
var setImgHoverSrc = function (thidcd) {   //一级菜单以外的菜单图片 2为二级菜单 3为三级菜单
    return baseURL + 'asserts/images/menus/' + thidcd + '_hover.png';
};


var colorContent = ["#57889c", "#a57225", "#6e587a", "#4c4f53", "#71843f", "#a8829f", "#68481b", "#a043d5", "#da71c2", "#3b434f"];
var historyLists = new History("win_history");
var thFlg = location.hash.replace(/^#/, '');   //得到当前地址上的锚点
var base_64 = new Base64();
var rootcddm = "";
//var thdata = [];
if (thFlg.length > 0) {  //针对于节点，而实现反编译！
    try {
        var str_t = base_64.decode(thFlg);
        var splits = str_t.split("_");
        var splitLength = splits.length;
        rootcddm = splits[splitLength - 1];
    } catch (e) {
        console.log(e);
    }
}
// $.ajax({
//     url: baseURL + 'getMenus',
//     type: 'POST',
//     dataType: 'text',
//     async: false,
//     data: {sjcddm: rootcddm},
// }).done(function (datas) {
//     var data = eval(datas)[0];
//     $.each(data, function (index, val) {
//         var thli = "";
//         if (data[index].childs.length > 0) {
//             thli = $('<li class="treeview" cdmc="' + data[index].cdmc + '" ><a href="javascript:void(0)"    cdmc="' + data[index].cdmc + '"><img src="' + returnImgHoverSrc(data[index].cddm) + '"   class="left_menu_14" thidcd=' + data[index].cddm + '><span>' + data[index].cdmc + '</span><i class="fa fa-angle-left pull-right"></i></a></li>');
//             var ej = '<ul class="treeview-menu">  </ul>';
//             var thej = $(ej).appendTo(thli);
//             var chs = data[index].childs;
//             eachTrees(chs, thej, index);
//         } else {
//             thli = $('<li class="treeview"  cdmc="' + data[index].cdmc + '"  ><a   href="' + baseURL + data[index].path + '"       cddm="' + data[index].cddm + '"  id="' + data[index].cddm + '_' + rootcddm + '"   class="ajax-link"   >' + setImgSrc(2, data[index]) + '</a></li>');
//         }
//         //$(thli).appendTo('#leftMenu');
//     });
//
// }).fail(function () {
//     console.log("error");
// }).always(function () {
//     console.log("complete");
// });

if (thFlg.length > 0) {
    try {
        $("#" + str_t).parents("li").addClass("active");
        $("#" + str_t).parents("ul").css("display", "block");
        var arr = [];
        $("#" + str_t).parents("li").each(function (index, data_a) {
            arr.push($(data_a).attr('cdmc'));
        })
        var cdmcpx = arr.reverse();//反序
        var naviHtml = '<i class="fa win-navigation">&nbsp;</i>';
        var appendFlg = "";
        $.each(cdmcpx, function (index) {
            naviHtml += appendFlg + cdmcpx[index];
            appendFlg = '&nbsp;<i class="fa fa-angle-right"></i>&nbsp;';
        })
        $("#title_dh").html(naviHtml);//设置导航
    } catch (e) {
        defaultposition();
    }
}
//递归菜单
// function eachTrees(data, sj, indexs) {
//     $.each(data, function (index, val) {
//         var indexs_t = indexs + "_" + index;
//         if (data[index].childs.length > 0) {
//             var tj = $('<li cdmc="' + data[index].cdmc + '" ><a href="javascript:void(0)"     >' + setImgSrc(2, data[index]) + '<i class="fa fa-angle-left pull-right"></i></a></li>').appendTo(sj);
//             var tjj = '<ul class="treeview-menu"></ul>';
//             var sanj = $(tjj).appendTo(tj);
//             var sanjs = data[index].childs;
//             eachTrees(sanjs, sanj, indexs_t);
//         } else {
//             $('<li cdmc="' + data[index].cdmc + '"><a href="' + baseURL + data[index].path + '"       cddm="' + data[index].cddm + '"  id="' + data[index].cddm + '_' + rootcddm + '"   class="ajax-link"  >' + setImgSrc(2, data[index]) + '</a></li>').appendTo(sj);
//             var child_data = {
//                 "cdmc": data[index].cdmc,
//                 "thurl": data[index].path,
//                 "cddm": data[index].cddm,
//                 "cdflg": indexs_t + '_'
//             };
//             thdata.push(child_data);
//         }
//     })
// }
//若无锚点 类似直接跳转的情况判断
if (thFlg.length == 0) {
    defaultposition();
}
var currentUrl = window.location.href;
if (currentUrl.indexOf("#") != -1) {
    currentUrl = currentUrl.substring(0, currentUrl.indexOf("#"));
}
var currentUrl_block = currentUrl.substring(baseURL.length);
//计算默认的节点
function defaultposition() {
    //暂不处理

    //
    //var thisObj = $("a[href$='" + currentUrl_block + "']").first();
    //alert(currentUrl_block);
    // if (thisObj.attr('first') != undefined) {
    //     thisObj.parents("li").addClass("active");
    //     thisObj.parents("ul").css("display", "block");
    //     $("#title_dh").html('<i class="fa win-navigation">&nbsp;</i>' + thisObj.attr('first') + '&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;' + thisObj.attr('second') + '&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;' + thisObj.attr('three'));
    // } else {
    //     if (currentUrl_block.indexOf("&") != -1) {
    //         currentUrl_block = currentUrl_block.substring(0, currentUrl_block.indexOf("&"));
    //         var thisObj2 = $("a[href$='" + currentUrl_block + "']").first();
    //         if (thisObj2.attr('first') != undefined) {
    //             thisObj2.parents("li").addClass("active");
    //             thisObj2.parents("ul").css("display", "block");
    //             $("#title_dh").html('<i class="fa win-navigation">&nbsp;</i>' + thisObj2.attr('first') + '&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;' + thisObj2.attr('second') + '&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;' + thisObj2.attr('three'));
    //         }
    //     } else {
    //         $("#title_dh").html('<i class="fa win-navigation">&nbsp;</i>');
    //     }
    // }
}
//
// //菜单跳转，渲染图片为选中状态
// var imgCdActive = function (Object) {
//     var $thisObj = $(Object);
//     //菜单一级菜单显示选中状态下的图片
//     var checkElement = $thisObj.parents("li").last().find("ul").first();
//     var $imgElement = $thisObj.parents("li").last().find("a").find('img').first();   //第一个节点最上面的菜单
//     //点击一级菜单 切换菜单图片
//     var thidcd = $imgElement.attr("thidcd");
//     if (isWhiteTm == 1) { //白色
//         $imgElement.attr('src', returnImgActiveSrc(thidcd));
//         //一级菜单添加两个背景图片
//         checkElement.find('li').first().find('a').first().addClass('treeview-top-img');
//         var aimgHtml = '<div class="treeview-bottom-img" id="bgImgDiv" style="display:block;height:10px;border:0"></div>';
//         $('#bgImgDiv').remove();
//         checkElement.append(aimgHtml);
//         //左侧菜单右边加上阴影
//         $('#left-sidebar-aside').removeClass("left-menu-shadow").addClass("left-menu-shadow");
//         //链接菜单切换图片
//         $.each($thisObj.parents("li"), function (index, obj) {
//             var $obj = $(obj);
//             if (!$obj.is('.treeview')) {  //排除一级菜单
//                 $imgElement = $obj.children('a').find("img");
//                 $imgElement.attr('src', setImgActiveSrc($imgElement.attr('thidcd')));
//             }
//         });
//     } else {
//         $imgElement.attr('src', returnImgActiveSrc(thidcd));
//     }
// };

//得到HTML的缓存处理对象
var storage = window.localStorage;
var firstNode = $("a[href$='" + currentUrl_block + "']").first();
if (firstNode.attr("three") != undefined) {
    historyLists.add(firstNode.attr("three"), window.location.href, firstNode.attr("cddm"));
}
var historyList = historyLists.getList();

if (historyList == null) {
    $("#historyHiddenCount").text(0);
} else {
    $("#historyHiddenCount").text(historyList.length);
    /**
     * 获取历史数据
     */
    var historyContent = $("#shortcut").find("ul");
    historyContent.html("");
    var historyListCt = historyList.length - 1;
    $.each(historyList, function (index2, val) {
        var index_tp = historyListCt - index2;
        var tmpHtml = "  <li><a  href='" + historyList[index_tp].link + "' class=\"history-tile big-cubes bg-color-blue\"  style='background-color: " + colorContent[index2] + "'> <span class=\"iconbox\"><img src=\"" + baseURL + "asserts/images/menus/icon_" + historyList[index_tp].other + ".png\" height='30px' width='30px' style='margin: 25px;margin-left: 40px;margin-bottom: 30px;margin-top: 32px;'><span>" + historyList[index_tp].title + " <span class=\"label pull-right bg-color-darken\">&nbsp;" + historyList[index_tp].count + "&nbsp;</span></span> </span> </a></li>";
        //得到初始化菜单的menuId
        var thFlg = historyList[index_tp].link.split("#");
        var menuId = "#" + thFlg[1];
        if (storage.getItem("menuId") == null) {
            storage.setItem("menuId", menuId);
        }
        // alert(storage.getItem("menuId"));
        historyContent.append(tmpHtml);
    });
}
//-------------------------菜单权限结束------------------------------------
function imgError(obj) {
    $(obj).attr("src", baseURL + "asserts/images/menus/icon_160103.png");
}

//判断是否是全路径的URL链接
var isUrl = function (s) {
    var patrn = /^(http:\/\/)|^(https:\/\/)/;
    return patrn.test(s);
}

$('#leftMenu').on('click', 'a', function (e) {
    if ($(this).hasClass('ajax-link')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var flgId = $(this).attr('id');
        var jzfs = $(this).attr('jzfs');
        var indexOf = url.indexOf("?");
        if (jzfs == '1') {//弹出的方式加载
            if (isUrl(url)) {//如果是URL链接
                window.open(url);
            } else {
                window.open(baseURL + url + "#" + base_64.encode(flgId));
            }
        } else {//本页面加载
            if (isUrl(url)) {//如果是URL链接暂不处理 用iframe的方式加载

            } else {//本页面加载
                $(document).ajaxStart(function () {
                    Pace.restart();
                });
                if (baseURL.indexOf("?") == -1)
                    window.location.href = baseURL + url + "?f=m#" + base_64.encode(flgId);
                else
                    window.location.href = baseURL + url + "&f=m#" + base_64.encode(flgId);
            }
        }
    }
});

$("#frame_refresh").click(function (event) {
    window.location.reload();
});

$("#frame_back").click(function (event) {
    window.history.go(-1);
});

$("#frame_bigger").click(function (event) {
    $("body").addClass('sidebar-collapse');
    cookie.set("winning_sider", "0", 1800);
});

$("#frame_full").click(function (event) {
    fullScreen();
});

function fullScreen() {
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        // for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}


if (cookie.get("winning_sider")) {
    var flg_sider = cookie.get("winning_sider");

    if (flg_sider == "1") {
        // $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
    } else if (flg_sider == "0") {
        // $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
    }
}


$.fn.autoComplete = function (config) {
    //Add dropdown menu to parent div
    var list = $('<ul />').attr('class', 'dropdown-menu').attr('role', 'listbox').attr('style', 'overflow-x:hidden;top:32px;font-size:13px;width:100%;').attr('id', 'cdjs');
    $(this).closest('div').append(list);
    $(this).keyup(function () {
        //Character length needs to be higher or equal to min length
        var searchValue = $(this).val().toLowerCase();
        if (searchValue.length < config.minLength) {
            return console.log('Not enough characters set');
        }
        var data = thdata;
        //Get resultset bij query
        //alert(data);
        //Data is empty
        list.empty();
        if (!data.length) {
            return list.append($('<li />').html(config.noResultText));
        }
        //Add records to dropdown
        data.forEach(function (record) {
            if (config.filter && record[config.label].toLowerCase().indexOf(searchValue) != -1 || !config.filter) {
                listitem = $('<li />').append($('<a  thurl="' + record["thurl"] + '"  cdflg="' + record["cdflg"] + '"  onclick="menuSelect(this)" />').attr('role', 'option').html(record[config.label]));
                list.append(listitem);
                list.show();
                listitem.click(function () {
                    config.onselect(record, listitem);
                    list.empty();
                    list.hide();
                });
            }
        });
        if (list.children().size() == 0) {
            list.empty();
            list.hide();
        }

    });


};


function menuSelect(obj) {

    window.location.href = baseURL + $(obj).attr("thurl") + "#" + base_64.encode($(obj).attr("cdflg"));
}

/*
 *菜单检索事件
 */
$(document).ready(function () {
    $('input#autocomplete').autoComplete({
        //Min length of characters before autocomplete will be triggered
        minLength: 1,
        //Path to dataset. Path will be completed with '?query='
        label: 'cdmc',
        //If set to false, autocomplete does not filter the datasource for you
        filter: true,
        //String which will be displayed in autocomplete when there is no result
        noResultText: '未找到',
        //Callback when user clicks autocomplete item
        onselect: function (user) {
            $('input#autocomplete').val('');
        }
    });
    //修改密码框显示
    $('.user_info').parent('a').click(function () {
        $('#pwDiv').slideToggle();
        $('#pwForm2')[0].reset();
        $('#pwErrorMsg').text('');
    });
    $('#xmm').keyup(function () {
        $this = $(this);
        checkPw($this.val());
        if ($.trim($('#mmqr').val()) != '') {
            $('#mmqr').trigger('keyup');
        }
    });
    $('#mmqr').keyup(function () {
        $this = $(this);
        if ($this.val() != $('#xmm').val()) {
            $('#pwErrorMsg').text("提示:密码确认跟新密码不同");
            $('#pwErrorMsg').css('color', 'red');
            return false;
        } else {
            $('#pwErrorMsg').text("");
            return true;
        }
    });
    $('#pwButton').click(function () {
        if ($('#ymm').val() == '') {
            $('#pwErrorMsg').text("提示:原密码不能为空");
            $('#pwErrorMsg').css('color', 'red');
            return false;
        }
        if (!checkPw($('#xmm').val())) {
            return false;
        }
        if (!checkPw($('#mmqr').val())) {
            return false;
        }
        if ($this.val() != $('#xmm').val()) {
            $('#pwErrorMsg').text("提示:密码确认跟新密码不同");
            $('#pwErrorMsg').css('color', 'red');
            return false;
        }
        loadMessage();
        jQuery.ajax({
            url: baseURL + 'changePw',
            type: 'POST',
            data: {
                ymm: $('#ymm').val(),
                xmm: $('#xmm').val()
            }
        }).done(function (jsonObj) {  //将json的数据组装成js对象
            hideMessage();
            if (jsonObj == '0') {
                alertMsgInfo("密码修改失败,请确认原密码是否正确?");
            } else {
                alertMsgInfo("密码修改成功!");
                $('.user_info').parent('a').trigger('click');
            }

        });
    });
    /*左侧菜单的box-shadow属性 跟随滚动条重新赋值
     *  1.原因:当body出现滚动条,向下滚动,左侧菜单右边下方位置出现留白
     * */
    $(window).bind("scroll", function () {
        if (isWhiteTm == 1) {
            $('#left-sidebar-aside').css("height", ($(window).height() + $(window).scrollTop()) + "px");
            $('#left-sidebar-aside').removeClass("left-menu-shadow").addClass("left-menu-shadow");
        }
    });
});

var checkPw = function (val) {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var valT = val;
    if (valT.length < 7) {
        $('#pwErrorMsg').text("提示:密码长度必须8位");
        $('#pwErrorMsg').css('color', 'red');
        return false;
    }
    if (strongRegex.test(valT)) { //密码为8位及以上并且字母数字特殊字符三项都包括,强度最强
        $('#pwErrorMsg').text("提示:密码强度高");
        $('#pwErrorMsg').css('color', 'green');
    }
    else if (mediumRegex.test(valT)) {  //密码为8位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
        $('#pwErrorMsg').text("提示:密码强度中等");
        $('#pwErrorMsg').css('color', '#F78115');
    }
    else {
        $('#pwErrorMsg').text("提示:密码强度弱");
        $('#pwErrorMsg').css('color', 'red');
    }
    return true;
};

/**
 * ie9文本框默认提示不显示问题修复
 */
$(function () {
    // Invoke the plugin
    $('input, textarea').placeholder();
});


$("body").bind("click", function () {
    $("#cdjs").empty();
    $("#cdjs").hide();
    $('input#autocomplete').val("");
    //$('.control-sidebar').removeClass('control-sidebar-open');
});

$(".content-wrapper").bind("click", function () {
    $('.control-sidebar').removeClass('control-sidebar-open');
});
$(".main-sidebar").bind("click", function () {
    $('.control-sidebar').removeClass('control-sidebar-open');
});


var shortcut_dropdown = $("#shortcut");
function a() {
    shortcut_dropdown.animate({
            "height": "hide"
        },
        300)
}
function b() {
    shortcut_dropdown.animate({
            "height": "show"
        },
        200)
}
$("#historyHidden").click(function () {
    shortcut_dropdown.is(":visible") ? a() : b()
})
$(document).mouseup(function (b) {
    shortcut_dropdown.is(b.target) || 0 !== shortcut_dropdown.has(b.target).length || a()
})



$( document ).bind(
    'fullscreenchange webkitfullscreenchange mozfullscreenchange',
    function(){
        if(isFullscreen()){
        }else{
            var fscreenClass=  cookie.get("fscreenClass");
            var fscreenHeight = cookie.get("fscreenHeight");
            document.getElementById("fscreenDiv").setAttribute("class",fscreenClass);
            document.getElementById("fscreenDiv").style.height=fscreenHeight+"px";
            document.getElementById("fscreenDiv").setAttribute("id","");
        }
    }
);

function isFullscreen() {
    return document.fullscreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        false;
}


var script=document.createElement("script");
script.type="text/javascript";
script.src=baseURL+"asserts/layer/layer.js";
document.getElementsByTagName('head')[0].appendChild(script);


