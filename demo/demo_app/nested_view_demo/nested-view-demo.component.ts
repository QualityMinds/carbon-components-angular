import { Component, OnInit } from "@angular/core";

@Component({
	selector: "nested-view-demo",
	templateUrl: "./nested-view-demo.component.html"
})
export class NestedViewDemo {
	private demoItems = [
		{
			content: "item one",
			selected: false
		},
		{
			content: "item two",
			selected: false,
			subMenu: [
				{
					content: "sub item two 1",
					selected: false
				},
				{
					content: "sub item two 2",
					selected: false,
					subMenu: [
						{
							content: "sub item two 1b",
							selected: false
						},
						{
							content: "sub item two 2b",
							selected: false,


						}
					]
				},
			]
		},
		{
			content: "item three",
			selected: false
		},
		{
			content: "item four",
			selected: false
		},
		{
			content: "item six",
			selected: false,
			subMenu: [
				{
					content: "sub item six 1",
					selected: false
				},
				{
					content: "sub item six 2",
					selected: false,
					subMenu: [
						{
							content: "sub item six 1b",
							selected: false
						},
						{
							content: "sub item six 2b",
							selected: false,
						}
					]
				},
			]
		}
	];

	onSelect(ev) {
		ev.item.selected = !ev.item.selected;
	}
}
