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
import { Textarea } from '../ui/textarea';

export default function PromptBasicFieldSet({ formData, handleInputChange, errors = {} }) {
  const { title, slug, description, template, examples } = formData;

  return (
    <FieldSet>
      <FieldLegend>Basic Information</FieldLegend>
      <FieldDescription>
        Core details and structure of your prompt.
      </FieldDescription>
      <FieldGroup>
        {/* Field Title */}
        <Field>
          <FieldLabel htmlFor="title">Title *</FieldLabel>
          <Input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={handleInputChange}
            placeholder="e.g. Concise Product Description"
            className={`${errors.title ? "border-red-500 focus-visible:ring-red-300 focus-visible:border-red-500" : ""}`}
          />
          <FieldError>{errors.title}</FieldError>
        </Field>

        {/* Field Slug */}
        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            type="text"
            name="slug"
            value={slug}
            onChange={handleInputChange}
            placeholder="Leave blank to auto-generate"
          />
          <FieldDescription>
            The URL-friendly version of the title.
          </FieldDescription>
        </Field>

        {/* Field Description */}
        <Field>
          <FieldLabel htmlFor="description">Description *</FieldLabel>
          <Input
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            placeholder="Briefly describe what this prompt does"
            className={`${errors.description ? "border-red-500 focus-visible:ring-red-300 focus-visible:border-red-500" : ""}`}
          />
          <FieldError>{errors.description}</FieldError>
        </Field>

        {/* Field Template */}
        <Field>
          <FieldLabel htmlFor="template">Template *</FieldLabel>
          <Textarea
            id="template"
            name="template"
            value={template}
            onChange={handleInputChange}
            placeholder="Write a {length} product description for a {product}..."
            className={`min-h-30 ${errors.template ? "border-red-500 focus-visible:ring-red-300 focus-visible:border-red-500" : ""}`}
          />
          <FieldError>{errors.template}</FieldError>
        </Field>

        {/* Field Examples */}
        <Field>
          <FieldLabel htmlFor="examples">Examples</FieldLabel>
          <Textarea
            id="examples"
            name="examples"
            value={examples}
            onChange={handleInputChange}
            placeholder="Put each example on a new line"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
