import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../ui/field';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

export default function PromptVariablesFieldSet({ variables, addVariableRow, updateVariable, removeVariable, errors = {} }) {
  return (
    <FieldSet>
      <div className="flex items-center justify-between">
        <div>
          <FieldLegend>Variables</FieldLegend>
          <FieldDescription>
            Dynamic inputs required for this prompt.
          </FieldDescription>
        </div>
        {/* Add Variable Button */}
        <Button className="flex items-center gap-1" type="button" variant="outline" onClick={addVariableRow}>
          <Plus aria-label="plus icon" />
          Variable
        </Button>
      </div>
      <FieldGroup>
        {variables.map((v, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 bg-gray-50 border rounded-lg"
          >
            {/* Field Name */}
            <div className="md:col-span-3">
              <Input
                value={v.name}
                name="name"
                onChange={(e) => updateVariable(idx, 'name', e.target.value)}
                placeholder="Name (e.g. length) *"
                className='w-full'
              />
            </div>

            {/* Field Type */}
            <div className="md:col-span-2">
              <Input
                value={v.type}
                name="type"
                onChange={(e) => updateVariable(idx, 'type', e.target.value)}
                placeholder="Type (e.g. string) *"
                className='w-full'
              />
            </div>

            {/* Field Placeholder */}
            <div className="md:col-span-4">
              <Input
                value={v.placeholder}
                name="placeholder"
                onChange={(e) =>
                  updateVariable(idx, 'placeholder', e.target.value)
                }
                placeholder="Placeholder"
                className="w-full"
              />
            </div>

            {/* Field Required */}
            <div className="md:col-span-2 flex items-center justify-center">
              <Field orientation="horizontal" className="mb-0">
                <Switch
                  id={`req-${idx}`}
                  name="required"
                  checked={v.required}
                  onCheckedChange={(checked) =>
                    updateVariable(idx, 'required', checked)
                  }
                />
                <FieldLabel
                  htmlFor={`req-${idx}`}
                  className="text-sm whitespace-nowrap"
                >
                  Required
                </FieldLabel>
                
              </Field>
            </div>

            {/* Delete Variable Button */}
            <div className="md:col-span-1 flex justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeVariable(idx)}
                className="rounded-full"
              >
                <Trash2 className='size-5' />
              </Button>
            </div>
          </div>
        ))}
        <FieldError>{errors.variables}</FieldError>
      </FieldGroup>
    </FieldSet>
  );
}
