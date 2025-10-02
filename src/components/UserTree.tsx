import { useState, useCallback, useMemo } from "react";
import type { UserNode } from "../types";
import { UserCard } from "./UserCard";

interface UserTreeProps {
  node: UserNode;
  level?: number;
}

const TREE_INDENT_PX = 32;

export function UserTree({ node, level = 0 }: UserTreeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  // Memoize toggle function - critical since this component is recursive
  // Using functional update to avoid dependency on isExpanded
  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Memoize inline style object to prevent recreation on every render
  const paddingStyle = useMemo(
    () => ({
      paddingLeft: `${level * TREE_INDENT_PX}px`,
    }),
    [level]
  );

  // Memoize aria-label string to avoid recreation
  const expandButtonLabel = useMemo(
    () => `${isExpanded ? "Collapse" : "Expand"} ${node.firstName} ${node.lastName}'s team`,
    [isExpanded, node.firstName, node.lastName]
  );

  return (
    <div role='treeitem' aria-expanded={hasChildren ? isExpanded : undefined} aria-level={level + 1}>
      <div style={paddingStyle} className='flex items-center gap-2'>
        {hasChildren ? (
          <button
            onClick={toggleExpand}
            className='flex items-center cursor-pointer justify-center font-bold text-4xl'
            aria-label={expandButtonLabel}
          >
            {isExpanded ? "−" : "+"}
          </button>
        ) : (
          <div className='text-4xl font-bold' aria-hidden='true'>
            −
          </div>
        )}

        <div className='flex-1'>
          <UserCard user={node} />
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div role='group'>
          {node.children.map((child) => (
            <UserTree key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
