import { Component, HostListener, ElementRef } from "@angular/core";
import { Dialog } from "../dialog.component";
import { position } from "../../utils/position";
import { getFocusElementList, isFocusInLastItem, isFocusInFirstItem } from "./../../common/tab.service";
import { I18n } from "./../../i18n/i18n.module";

/**
 * Extend the `Dialog` component to create an overflow menu.
 *
 * Not used directly. See overflow-menu.component and overflow-menu.directive for more
 */
@Component({
	selector: "ibm-overflow-menu-pane",
	template: `
		<ul
			[attr.aria-label]="dialogConfig.menuLabel"
			[ngClass]="{'bx--overflow-menu--flip': dialogConfig.flip}"
			role="menu"
			#dialog
			class="bx--overflow-menu-options bx--overflow-menu-options--open"
			role="menu"
			(focusout)="clickClose($event)"
			[attr.aria-label]="dialogConfig.menuLabel">
			<ng-template
				[ngTemplateOutlet]="dialogConfig.content"
				[ngTemplateOutletContext]="{overflowMenu: this}">
			</ng-template>
		</ul>
	`
})
export class OverflowMenuPane extends Dialog {

	constructor(protected elementRef: ElementRef, protected i18n: I18n) {
		super(elementRef);
	}

	onDialogInit() {
		/**
		 *  -20 shifts the menu up to compensate for the
		 *  extra offset generated by the wrapper component.
		 *
		 *  60 shifts the menu right to align the arrow.
		 * (position service trys it's best to center everything,
		 * so we need to add some compensation)
		 */
		this.addGap["bottom"] = pos => {
			if (this.dialogConfig.flip) {
				return position.addOffset(pos, -20, -60);
			}
			return position.addOffset(pos, -20, 60);
		};

		if (!this.dialogConfig.menuLabel) {
			this.dialogConfig.menuLabel = this.i18n.get().OVERFLOW_MENU.OVERFLOW;
		}

		setTimeout(() => {
			getFocusElementList(this.elementRef.nativeElement).every(button => {
				// Allows user to set tabindex to 0.
				if (button.getAttribute("tabindex") === null) {
					button.tabIndex = -1;
				}
			});
			this.listItems()[0].focus();
		}, 0);
	}

	@HostListener("keydown", ["$event"])
	hostkeys(event: KeyboardEvent) {
		const listItems = this.listItems();

		switch (event.key) {
			case "Down": // IE specific value
			case "ArrowDown":
				event.preventDefault();
				if (!isFocusInLastItem(event, listItems))  {
					const index = listItems.findIndex(item => item === event.target);
					listItems[index + 1].focus();
				} else {
					listItems[0].focus();
				}
				break;

			case "Up": // IE specific value
			case "ArrowUp":
				event.preventDefault();
				if (!isFocusInFirstItem(event, listItems))  {
					const index = listItems.findIndex(item => item === event.target);
					listItems[index - 1].focus();
				} else {
					listItems[listItems.length - 1].focus();
				}
				break;

			case "Home":
				event.preventDefault();
				listItems[0].focus();
				break;

			case "End":
				event.preventDefault();
				listItems[listItems.length - 1].focus();
				break;

			case "Esc": // IE specific value
			case "Escape":
				event.stopImmediatePropagation();
				this.doClose();
				break;
		}
	}

	clickClose(event) {
		// Opens menu when clicking on the menu button and stays open while navigating through the options
		if (this.dialogConfig.parentRef.nativeElement.firstChild.contains(event.target) ||
			this.listItems().some(button => button === event.relatedTarget) ||
			event.type === "focusout" && event.relatedTarget === this.dialogConfig.parentRef.nativeElement) {
			return;
		}
		this.doClose();
	}

	private listItems() {
		return Array.from<any>(this.elementRef.nativeElement.querySelectorAll(".bx--overflow-menu-options__btn:not([disabled])"));
	}
}
