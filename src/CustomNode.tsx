import { MouseEventHandler } from 'react';
import { NodeProps, useReactFlow } from '@xyflow/react';
import './app.css';

// import styles from './styles.module.css';
import { ExpandCollapseNode } from './types';

type GetLabelParams = {
  expanded: boolean;
  expandable?: boolean;
};

// this function returns the label for the node based on the current state
function getLabel({ expanded, expandable }: GetLabelParams): string {
  if (!expandable) {
    return 'nothing to expand';
  }

  return expanded ? 'Click to collapse ▲' : 'Click to expand ▼';
}

export default function CustomNode({
  data,
  id,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps<ExpandCollapseNode>) {
  const { addNodes, addEdges } = useReactFlow();

  const addChildNode: MouseEventHandler = (evt) => {
    // prevent the expand/collapse behaviour when a new node is added while the
    // node is expanded
    if (data.expanded) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    const newNodeId = `${id}__${new Date().getTime()}`;

    // the edge between the clicked node and the child node is created
    addNodes({
      id: newNodeId,
      position: { x: positionAbsoluteX, y: positionAbsoluteY + 100 },
      data: { label: 'X' },
    });
    addEdges({ id: `${id}->${newNodeId}`, source: id, target: newNodeId });
  };

  // based on the state of the node, we show the label accordingly
  const label = getLabel(data);

  return (
    <div className={'node'}>
      <div className={'label'}>{label}</div>
      {/* <Handle position={Position.Top} type="target" />
      <Handle position={Position.Bottom} type="source" /> */}
      <div className={'button'} onClick={addChildNode}>
        + add child node
      </div>
    </div>
  );
}
