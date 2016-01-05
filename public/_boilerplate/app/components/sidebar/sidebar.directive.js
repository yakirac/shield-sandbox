;(function() {
	"use strict";
	//directives
	angular.module("app.core").directive("sidebar", ["sidebarService", fnDirective]);
	//controllers
	angular.module("app.core").controller("sidebarController", ["sidebarService", fnController]);
	//the controller
	function fnController(sidebarService) {
		/*jshint validthis: true */
		var vm = this;
		vm.sidebar = sidebarService.getSidebar();
		vm.makeLinkActive = fnMakeLinkActive;
		vm.selectedIndex = 1;
		function fnMakeLinkActive(i) {
			vm.selectedIndex = i;
		}
	}
	//the directive
	function fnDirective(sidebarService) {
		//config
		return {
			restrict: "AE",
			scope: {},
			replace: false,
			templateUrl: "app/components/sidebar/sidebar.html",
			link: fnLink,
			controller: "sidebarController",
			controllerAs: "vm"
		};
		//link
		function fnLink(scope) {
			//setthe scope
			scope.setActiveLink = fnSetActiveLink;
			scope.isSelected = fnIsSelected;
			scope.selected = sidebarService.getFirstNavItem();
			scope.sub_nav = false;
			scope.hasSubNav = fnHasSubNav;
			//isSelected
			function fnIsSelected(nav_item) {
				return angular.equals(scope.selected, nav_item);
			}
			//fnSetActiveLink
			function fnSetActiveLink(nav_item) {
				scope.selected = nav_item;
				scope.sub_nav = false;
				if (angular.isDefined(nav_item.subnav) && nav_item.subnav.length) {
					scope.sub_nav = true;
				}
			}
			//fnHasSubNav
			function fnHasSubNav(nav_item) {
				if (fnIsSelected(nav_item) && angular.isDefined(nav_item.subnav) && nav_item.subnav.length) {
					return true;
				}
				return false;
			}
		}
	}
})();
