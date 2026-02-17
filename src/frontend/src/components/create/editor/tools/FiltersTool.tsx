import { Button } from '@/components/ui/button';
import type { EditorState, Filter } from '../../../../utils/editor/types';

interface FiltersToolProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
}

const filters: Filter[] = ['none', 'bw', 'sepia', 'contrast', 'vintage', 'cool'];

export default function FiltersTool({ editorState, onStateChange }: FiltersToolProps) {
  const toggleFilter = (filter: Filter) => {
    const newFilters = editorState.filters.includes(filter)
      ? editorState.filters.filter(f => f !== filter)
      : [filter];
    onStateChange({ ...editorState, filters: newFilters });
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {filters.map(filter => (
        <Button
          key={filter}
          variant={editorState.filters.includes(filter) ? 'default' : 'outline'}
          onClick={() => toggleFilter(filter)}
          className="text-white capitalize"
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
