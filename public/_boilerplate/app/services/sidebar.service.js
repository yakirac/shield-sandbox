;(function() {
	"use strict";
	// factory
	angular.module("app.core").factory("sidebarService", fnSidebar);

	function fnSidebar() {
		return {
			getSidebar: fnGetSidebar,
			getFirstNavItem: fnGetFirstNavItem
		};

		function fnGetFirstNavItem() {
			var nav_items = fnGetSidebar();
			return nav_items[0];
		}

		function fnGetSidebar() {
			return [{
				"id": "root_1",
				"href": "",
				"text": "Workshops itinerary",
				"subnav": []
			}];
/*
			return [{
				"id" : "root_1",
				"href": "/what-is-angular?scroll=subpage",
				"text": "1. What is "Angular"?",
				"subnav": []
			}, {
				"id" : "root_2",
				"href": "/what-is-spa?scroll=subpage",
				"text": "2. What is SPA?",
				"subnav": []
			}, {
				"id" : "root_3",
				"href": "/better-than-backbone?scroll=subpage",
				"text": "3. Better Than Backbone?",
				"subnav": []
			}, {
				"id" : "root_4",
				"href": "/setup-process?scroll=subpage",
				"text": "4. Setup Process?",
				"subnav": []
			}, {
				"id" : "root_5",
				"href": "/angular-components?scroll=subpage",
				"text": "5. What makes up Angular?",
				"subnav": [{
					"id" : "angular_component_1",
					"href": "/angular-components/modules?scroll=subpage",
					"text": "a. Modules"
				}, {
					"id" : "angular_component_2",
					"href": "/angular-components/routes?scroll=subpage",
					"text": "b. Routes"
				}, {
					"id" : "angular_component_3",
					"href": "/angular-components/controllers?scroll=subpage",
					"text": "c. Controllers"
				}, {
					"id" : "angular_component_4",
					"href": "/angular-components/data-binding?scroll=subpage",
					"text": "d. Data Binding"
				}, {
					"id" : "angular_component_5",
					"href": "/angular-components/directives?scroll=subpage",
					"text": "e. Directives"
				}, {
					"id" : "angular_component_6",
					"href": "/angular-components/services?scroll=subpage",
					"text": "g. Services"
				}, {
					"id" : "angular_component_6",
					"href": "/angular-components/filters?scroll=subpage",
					"text": "i. Filters"
				}]
			}, {
				"id" : "root_7",
				"href": "/whats-next",
				"text": "6. Whats Next?",
				"subnav": []
			}];
			*/
		}
	}
})();
