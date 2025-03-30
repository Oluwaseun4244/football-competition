import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface DropdownMenuProps {
  onConfirm: () => void;
  onReject: () => void;
  isPending: boolean;
  isApproved: boolean;
  teamId: number;
  onReOpen: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onConfirm,
  onReject,
  isPending,
  isApproved,
  teamId,
  onReOpen
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        disabled={isPending}
      >
        ...
      </button>

      {isOpen && (
        <div className="absolute flex flex-col gap-2 right-0 top-0 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              navigate(`/team/${teamId}`);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            disabled={isPending}
          >
            View Team
          </button>
          {
            isApproved ? <button
              onClick={() => {
                onReOpen();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              disabled={isPending}
            >
              {isPending ? 'Processing...' : 'Reopen'}
            </button> : <button
              onClick={() => {
                onConfirm();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              disabled={isPending}
            >
              {isPending ? 'Processing...' : 'Confirm'}
            </button>
          }

          <button
            onClick={() => {
              onReject();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            disabled={isPending}
          >
            {isPending ? 'Processing...' : 'Reject'}
          </button>

        </div>
      )}
    </div>
  );
};

export default DropdownMenu; 