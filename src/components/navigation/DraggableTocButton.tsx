'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';

interface DraggableTocButtonProps {
  className?: string;
}

const DraggableTocButton: React.FC<DraggableTocButtonProps> = ({ className = '' }) => {
  const buttonRef = useRef<HTMLLabelElement>(null);
  const [isTocVisible, setIsTocVisible] = useState(false);

  useEffect(() => {
    const tocButton = buttonRef.current;
    const tocCheckbox = document.getElementById('toc-toggle') as HTMLInputElement;
    if (!tocButton || !tocCheckbox) return;

    const handleTocToggle = () => {
      setIsTocVisible(tocCheckbox.checked);
    };

    tocCheckbox.addEventListener('change', handleTocToggle);

    let isDragging = false;
    let startY = 0;
    let startX = 0;
    let startTop = 0;
    let side = localStorage.getItem('tocButtonSide') || 'left';
    let dragMode: 'vertical' | 'horizontal' | null = null;
    let switchThreshold = window.innerWidth * 0.4; // 40% of screen width

    // Get the initial position from localStorage or use default
    const savedPosition = localStorage.getItem('tocButtonPosition');

    if (savedPosition) {
      tocButton.style.top = `${savedPosition}px`;
      tocButton.style.transform = 'translate(0, 0)';
    }

    // Apply the initial side
    if (side === 'right') {
      tocButton.style.left = 'auto';
      tocButton.style.right = '0';
    } else {
      tocButton.style.right = 'auto';
      tocButton.style.left = '0';
    }

    // Switch sides function
    const switchSides = (newSide: 'left' | 'right') => {
      if (newSide === 'right') {
        tocButton.style.left = 'auto';
        tocButton.style.right = '0';
        side = 'right';
      } else {
        tocButton.style.right = 'auto';
        tocButton.style.left = '0';
        side = 'left';
      }

      localStorage.setItem('tocButtonSide', side);
      tocButton.classList.add('side-switch-animation');
      setTimeout(() => {
        tocButton.classList.remove('side-switch-animation');
      }, 300);
    };

    // Start dragging
    const startDrag = (e: MouseEvent) => {
      // Only start drag if not clicking on the TOC toggle
      if (e.target instanceof Element) {
        const targetSpan = e.target.closest('span');
        if (targetSpan && !targetSpan.classList.contains('rotate-180')) {
          return;
        }
      }

      e.preventDefault();
      isDragging = true;
      startY = e.clientY;
      startX = e.clientX;
      startTop = tocButton.offsetTop;

      tocButton.classList.add('dragging');

      // Determine drag mode based on initial movement
      dragMode = null;
    };

    // Start dragging (touch)
    const startDragTouch = (e: TouchEvent) => {
      // Only start drag if not clicking on the TOC toggle
      if (e.target instanceof Element) {
        const targetSpan = e.target.closest('span');
        if (targetSpan && !targetSpan.classList.contains('rotate-180')) {
          return;
        }
      }

      isDragging = true;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      startTop = tocButton.offsetTop;

      tocButton.classList.add('dragging');

      // Determine drag mode based on initial movement
      dragMode = null;
    };

    // Dragging
    const drag = (e: MouseEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      const deltaY = e.clientY - startY;
      const deltaX = e.clientX - startX;

      // Determine drag mode if not already set
      if (!dragMode) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          dragMode = 'vertical';
        } else {
          dragMode = 'horizontal';
        }
      }

      if (dragMode === 'vertical') {
        // Vertical dragging
        let newTop = startTop + deltaY;

        // Constrain to viewport
        const buttonHeight = tocButton.offsetHeight;
        const maxTop = window.innerHeight - buttonHeight;
        newTop = Math.max(0, Math.min(newTop, maxTop));

        tocButton.style.top = `${newTop}px`;

        // Store the position
        localStorage.setItem('tocButtonPosition', newTop.toString());
      } else if (dragMode === 'horizontal') {
        // Simple side switching based on drag direction
        if (side === 'left' && deltaX > switchThreshold) {
          switchSides('right');
        } else if (side === 'right' && deltaX < -switchThreshold) {
          switchSides('left');
        }
      }
    };

    // Dragging (touch)
    const dragTouch = (e: TouchEvent) => {
      if (!isDragging) return;

      const deltaY = e.touches[0].clientY - startY;
      const deltaX = e.touches[0].clientX - startX;

      // Determine drag mode if not already set
      if (!dragMode) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          dragMode = 'vertical';
        } else {
          dragMode = 'horizontal';
        }
      }

      if (dragMode === 'vertical') {
        // Vertical dragging
        let newTop = startTop + deltaY;

        // Constrain to viewport
        const buttonHeight = tocButton.offsetHeight;
        const maxTop = window.innerHeight - buttonHeight;
        newTop = Math.max(0, Math.min(newTop, maxTop));

        tocButton.style.top = `${newTop}px`;

        // Store the position
        localStorage.setItem('tocButtonPosition', newTop.toString());
      } else if (dragMode === 'horizontal') {
        // Simple side switching based on drag direction
        if (side === 'left' && deltaX > switchThreshold) {
          switchSides('right');
        } else if (side === 'right' && deltaX < -switchThreshold) {
          switchSides('left');
        }
      }
    };

    // End dragging
    const endDrag = () => {
      if (!isDragging) return;

      isDragging = false;
      dragMode = null;
      tocButton.classList.remove('dragging');
    };

    // Add event listeners
    tocButton.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    tocButton.addEventListener('touchstart', startDragTouch, { passive: false });
    document.addEventListener('touchmove', dragTouch, { passive: false });
    document.addEventListener('touchend', endDrag);

    // Cleanup
    return () => {
      tocButton.removeEventListener('mousedown', startDrag);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', endDrag);
      tocButton.removeEventListener('touchstart', startDragTouch);
      document.removeEventListener('touchmove', dragTouch);
      document.removeEventListener('touchend', endDrag);
      tocCheckbox.removeEventListener('change', handleTocToggle);
    };
  }, []);

  return (
    <label
      ref={buttonRef}
      htmlFor="toc-toggle"
      className={[
        'fixed',
        'left-0',
        'top-1/2',
        '-translate-y-1/2',
        'z-[100]',
        'cursor-move',
        'flex',
        'items-center',
        'bg-white',
        'px-2',
        'py-3',
        'shadow-md',
        'hover:shadow-lg',
        'transition-all',
        'duration-700', // Increased from 500
        'ease-out',
        'peer-checked:translate-x-[320px]',
        'group',
        'touch-none',
        'will-change-transform',
        'border',
        'border-gray-200',
        'rounded-sm',
        'lg:hidden',
        'opacity-100 pointer-events-auto',
        className,
      ].join(' ')}
      style={{
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', // Increased durations and tweaked curve
      }}
    >
      <div className="flex flex-col items-center gap-1.5">
        <BookOpen className="w-4 h-4 text-gray-600" />
        <span className="text-gray-600 text-xs font-medium tracking-wide rotate-180 [writing-mode:vertical-lr]">
          TOC
        </span>
        <ChevronRight className="w-3 h-3 text-gray-600 transition-transform duration-500 group-hover:translate-x-0.5" />
      </div>

      <style jsx global>{`
        .dragging {
          opacity: 0.98;
          cursor: grabbing !important;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; // Added smooth opacity during drag
        }

        .side-switch-animation {
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) !important; // Smoother side switching
        }

        #toc-toggle:checked ~ label {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Smooth opacity and movement transitions */
        label[for="toc-toggle"] {
          transition-property: all, opacity, transform;
          transition-duration: 0.7s;
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateZ(0); /* Force GPU acceleration */
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </label>
  );
};

export default DraggableTocButton;
