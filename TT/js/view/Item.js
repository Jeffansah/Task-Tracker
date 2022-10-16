import Dropzone from "./Dropzone.js"
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item{
    constructor(itemId, content){
        const bottomDropZone = Dropzone.createDropZone();

        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban_item_input");

        this.elements.root.dataset.id = itemId;
        this.elements.input.textContent = content;
        this.content = content;
        this.elements.root.appendChild(bottomDropZone);

        const onBlur = () => {
			const newContent = this.elements.input.textContent.trim();

			this.content = newContent;

            if(this.content == content){
                return;
            }

			KanbanAPI.updateItem(itemId, {
				content: this.content
			});
		};

        this.elements.input.addEventListener("blur", onBlur);
		this.elements.root.addEventListener("dblclick", () => {
			const check = confirm("Are you sure you want to delete this item?");

			if (check) {
				KanbanAPI.deleteItem(itemId);

				this.elements.input.removeEventListener("blur", onBlur);
				this.elements.root.parentElement.removeChild(this.elements.root);
			}
		});
        
        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", itemId);
        })

        this.elements.input.addEventListener("drop", e =>{
            e.preventDefault();
        })
    }

    static createRoot(){
        const range = document.createRange();

		range.selectNode(document.body);

		return range.createContextualFragment(`
        <div class="kanban_item" draggable="true">
            <div class="kanban_item_input" contenteditable></div>
        </div>
		`).children[0];
    }
}