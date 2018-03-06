/** @module
*  DRAGONDROP
*/

/**
 * Drag and drop class.
 * @memberOf module:DRAGONDROP
 */

export class DragonDrop {

	constructor( dropZoneClass, dropZoneActiveClass, selectedClass, effect, itemWrapper ) {
		DragonDrop.dropZoneClass = dropZoneClass;
		DragonDrop.dropZoneActiveClass = dropZoneActiveClass;
		DragonDrop.selectedClass = selectedClass;
		DragonDrop.effect = effect;
		DragonDrop.itemWrapper = itemWrapper;
	}

	/**
     * Drag start event handler.  Sets chosen id in data for reference later.
     * @method dragonStart
	 * @memberOf module:DRAGONDROP
	 * @param {event} event The captured event
     */

	dragonStart( event, selectedClass ) {

		let e = event.nativeEvent,
			eDataTrans = e.dataTransfer,
			targetElem = event.target,
			targetId = targetElem.id;

		eDataTrans.effectAllowed = DragonDrop.effect;
		eDataTrans.setData( 'text', targetId ); // required for Firefox to function. IE only supports "text" or "URL"
		e.target.classList.add( DragonDrop.selectedClass );

		// set object property for later reference.
		DragonDrop.srcElem = targetId;

		// get the height for rendering drop zone to match.
		DragonDrop.eHeight = targetElem.children[0].offsetHeight;
	}

	/**
     * Drag over event handler method called when dragged item over target area.
	 * @memberOf module:DRAGONDROP
     * @method dragonOver
	 * @param {event} event The captured event
     */

	dragonOver( event ) {
		event.preventDefault();
		event.dataTransfer.dropEffect = DragonDrop.effect;
	}

	/**
     * Drag Enter event handler method called when dragged item enters a valid drop zone.
	 * @memberOf module:DRAGONDROP
     * @method dragonOver
	 * @param {event} event The captured event
     */

	dragonEnter( event ) {

		let e = event.nativeEvent,
			nativeTargetElem = e.target,
			closestElem = nativeTargetElem.closest( DragonDrop.itemWrapper );

		e.preventDefault();
		e.dataTransfer.effectAllowed = DragonDrop.effect;

		// apply if closest item exits and prevent class application on self
		if ( closestElem && DragonDrop.srcElem !== closestElem.id ) {

			// also make sure not over next sibling since that equates to dropping in current slot.
			if ( document.getElementById( DragonDrop.srcElem ).nextSibling.id !== closestElem.id ) {

				let newNode = document.createElement( 'div' );
				newNode.classList.add( DragonDrop.dropZoneClass );

				console.log( nativeTargetElem.closest( DragonDrop.itemWrapper ).children );

				// insert the dropzone element
				if ( nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass ).length === 0 ) {
					nativeTargetElem.insertBefore( newNode, nativeTargetElem.closest( DragonDrop.itemWrapper ).children[0] );
				}

				if ( nativeTargetElem ) {
					nativeTargetElem.classList.add( DragonDrop.dropZoneActiveClass );
					nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass )[0].style.height = DragonDrop.eHeight + 'px';
				}

			}
		}
	}

	/**
     * Drag leave event handler method called when dragged item over target exits the drop zone.
	 * @memberOf module:DRAGONDROP
     * @method dragonLeave
	 * @param {event} event The captured event
     */

	dragonLeave( event ) {

		let nativeTargetElem = event.nativeEvent.target;

		// reset height of drop zone
		if ( nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass )[0] ) {
			nativeTargetElem.removeChild( nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass )[0] );

			//nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass )[0].style.height = 0 + 'px';
			//nativeTargetElem.classList.remove( DragonDrop.dropZoneActiveClass );
		}

	}

	/**
     * Drag end event handler method called when dragged item is released, either in a valid drop zone or cancelled.
	 * @memberOf module:DRAGONDROP
     * @method dragonEnd
	 * @param {event} event The captured event
     */

	dragonEnd( event ) {

		event.nativeEvent.preventDefault();

		if ( document.getElementsByClassName( DragonDrop.selectedClass )[0] ) {
			document.getElementsByClassName( DragonDrop.selectedClass )[0].classList.remove( DragonDrop.selectedClass );
		}

	}

	/**
     * Drop event handler method called when dragged item released over valid drop zone.
	 * @memberOf module:DRAGONDROP
     * @method dragonDrop
	 * @param {event} event The captured event
     */

	dragonDrop( event ) {

		let e = event.nativeEvent,
			nativeTargetElem = e.target;

		e.preventDefault();

		nativeTargetElem.parentElement.insertBefore( document.getElementById( DragonDrop.srcElem ), nativeTargetElem );

		if ( nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass )[0] ) {
			nativeTargetElem.removeChild( nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass )[0] );
		}

		// nativeTargetElem.getElementsByClassName( DragonDrop.dropZoneClass )[0].style.height = 0 + 'px';
		// nativeTargetElem.classList.remove( DragonDrop.dropZoneActiveClass );

	}

}

/**
 * @memberOf module:DRAGONDROP
 * @property {element} srcElem - reference to the source element.
 * @property {number} eHeight - height of the chosen element.
 * @property {string} selectedClass - class to be applied to the selected element.
 * @property {string} dropZoneActiveClass - class to be applied to the drop zone when active.
 * @property {string} effect - effect allowed.
 * @property {string} itemWrapper - selector for finding nearest draggable item.
 */

DragonDrop.srcElem = '';
DragonDrop.eHeight = '';
DragonDrop.selectedClass = '';
DragonDrop.dropZoneActiveClass = '';
DragonDrop.effect = '';
DragonDrop.itemWrapper;

/* TODO */
// - look at functionality within UIEvent
