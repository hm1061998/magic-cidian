import React from "react";

interface WritingGridProps {
  character: string;
}

const WritingGrid: React.FC<WritingGridProps> = ({ character }) => {
  return (
    <div className="writing-grid">
      <svg className="writing-grid-lines" strokeWidth="1">
        <line x1="1" y1="1" x2="100%" y2="1" />
        <line x1="1" y1="1" x2="1" y2="100%" />
        <line x1="100%" y1="1" x2="100%" y2="100%" />
        <line x1="1" y1="100%" x2="100%" y2="100%" />
        <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="4 2" />
        <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="4 2" />
        <line x1="0" y1="0" x2="100%" y2="100%" strokeDasharray="4 2" />
        <line x1="100%" y1="0" x2="0" y2="100%" strokeDasharray="4 2" />
      </svg>
      <span className="writing-grid-char">{character}</span>
    </div>
  );
};

export default WritingGrid;
