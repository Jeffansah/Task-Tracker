import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
	static createDropZone() {
		const range = document.createRange();

		range.selectNode(document.body);

		const dropZone = range.createContextualFragment(`
			<div class="kanban_drop-zone"></div>
		`).children[0];

		dropZone.addEventListener("dragover", e => {
			e.preventDefault();
			dropZone.classList.add("kanban_drop-zone--active");
		});

		dropZone.addEventListener("dragleave", () => {
			dropZone.classList.remove("kanban_drop-zone--active");
		});

		dropZone.addEventListener("drop", e => {
			e.preventDefault();
			dropZone.classList.remove("kanban_drop-zone--active");

			const columnElement = dropZone.closest(".kanban_column");
			const columnId = Number(columnElement.dataset.id);
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban_drop-zone"));
            const droppedIndex = dropZonesInColumn.indexOf(dropZone);
            const itemId = Number(e.dataTransfer.getData("text/plain"));
            const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
            const insertAfterDropped = dropZone.parentElement.classList.contains(".kanban_column_item") ? dropZone.parentElement : dropZone;
            if(droppedItemElement.contains(dropZone)){
                return;
            }
            
            insertAfterDropped.after(droppedItemElement);
            KanbanAPI.updateItem(itemId,
                {
                    columnId,
                    position: droppedIndex,
                });
        });

        
        return dropZone;
    }



}