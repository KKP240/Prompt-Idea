import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams } from 'react-router';

export default function SortSelect({ curSortVal }) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Add Search Param
  const handleSelect = function(value){
    setSearchParams((searchParams) => {
      searchParams.set("sort_by", value);
      return searchParams;
    });
  }

  return (
    <Select value={curSortVal} onValueChange={(value) => handleSelect(value)}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a sort value" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort By</SelectLabel>
          <SelectItem value="likes">Most liked</SelectItem>
          <SelectItem value="alpha">Alphabetical (A–Z)</SelectItem>
          <SelectItem value="copies">Most copied</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
