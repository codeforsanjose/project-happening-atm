import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import './DragAndDrop.scss';

function DragAndDrop({ dropHandler, children }) {
  const dropRef = useRef();
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;

    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      dropHandler(e.dataTransfer.files);
    }

    dragCounter.current = 0;
  }, [dropHandler]);

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    const dropArea = dropRef.current;
    dropArea.addEventListener('dragenter', handleDragIn);
    dropArea.addEventListener('dragleave', handleDragOut);
    dropArea.addEventListener('dragover', handleDrag);
    dropArea.addEventListener('drop', handleDrop);

    return function removeDragListeners() {
      dropArea.removeEventListener('dragenter', handleDragIn);
      dropArea.removeEventListener('dragleave', handleDragOut);
      dropArea.removeEventListener('dragover', handleDrag);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, [handleDragIn, handleDragOut, handleDrop]);

  return (
    <div className="DragAndDrop" ref={dropRef}>
      {dragging && <div className="overlay" />}
      {children}
    </div>
  );
}

export default DragAndDrop;
