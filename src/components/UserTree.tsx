import { useState } from "react";
import type { UserNode } from "../types";
import { UserCard } from "./UserCard";

interface UserTreeProps {
  node: UserNode;
  removeUser: (user: UserNode) => void;
  level?: number;
}

const TREE_INDENT_PX = 32;

export function UserTree({ node, level = 0, removeUser }: UserTreeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div role='treeitem' aria-expanded={hasChildren ? isExpanded : undefined} aria-level={level + 1}>
      <div style={{ paddingLeft: `${level * TREE_INDENT_PX}px` }} className='flex items-center gap-2'>
        {hasChildren ? (
          <button
            onClick={toggleExpand}
            className='flex items-center cursor-pointer justify-center font-bold text-4xl'
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.firstName} ${
              node.lastName
            }'s team`}
          >
            {isExpanded ? "−" : "+"}
          </button>
        ) : (
          <div className='text-4xl font-bold' aria-hidden='true'>
            −
          </div>
        )}

        <div className='flex-1'>
          <UserCard user={node} removeUser={removeUser} />
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div role='group'>
          {node.children.map((child) => (
            <UserTree key={child.id} node={child} level={level + 1} removeUser={removeUser} />
          ))}
        </div>
      )}
    </div>
  );
}
