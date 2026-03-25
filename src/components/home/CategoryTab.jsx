import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function CategoryTab({ activeTab, categories, className = '' }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChangeCategoryTab = function(params){
    setSearchParams({ ...params });
  }

  return (
    <Tabs value={activeTab} className={cn(className)}>
      <div className="overflow-x-auto overflow-y-hidden">
        <TabsList variant="line" className="w-full justify-start border-b mb-6">
          {/* Tab Category - All */}
          <TabsTrigger
            value="all"
            onClick={() => onChangeCategoryTab({ page: '1' })}
            className="data-[state=active]:text-blue-500"
          >
            All
          </TabsTrigger>

          {/* Tab Categories */}
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => onChangeCategoryTab({ category, page: '1' })}
              className="data-[state=active]:text-blue-500"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
