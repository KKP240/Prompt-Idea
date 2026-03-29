import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field";
import { Switch } from "../ui/switch";

export default function PromptSettingFieldSet({ featured, handleCheckedChange }) {
  return (
    <FieldSet>
      <FieldLegend>Settings</FieldLegend>
      <FieldGroup>
        <Field orientation="horizontal">
          <Switch
            id="featured"
            name='featured'
            checked={featured}
            onCheckedChange={(checked) => handleCheckedChange('featured', checked)}
          />
          <FieldLabel htmlFor="featured">Featured Prompt</FieldLabel>
        </Field>
        <FieldDescription>
          Highlight this prompt on the homepage.
        </FieldDescription>
      </FieldGroup>
    </FieldSet>
  );
}
