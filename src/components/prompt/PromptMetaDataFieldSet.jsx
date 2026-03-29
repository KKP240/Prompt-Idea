import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "../ui/field";
import { Input } from "../ui/input";

export default function PromptMetaDataFieldSet({ formData, handleInputChange, errors = {} }) {
  const { category, tags, model, language, version, authorId, authorName, metaSource, metaLicense } = formData

  return (
    <FieldSet>
      <FieldLegend>Classification & Metadata</FieldLegend>
      <FieldDescription>
        Categorize your prompt and define its source.
      </FieldDescription>
      <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Field Category */}
        <Field>
          <FieldLabel htmlFor="category">Category *</FieldLabel>
          <Input
            id="category"
            type="text"
            name="category"
            value={category}
            onChange={handleInputChange}
            placeholder="marketing"
            className={`${errors.category ? "border-red-500 focus-visible:ring-red-300 focus-visible:border-red-500" : ""}`}
          />
          <FieldError>{errors.category}</FieldError>
        </Field>

        {/* Field Tags */}
        <Field>
          <FieldLabel htmlFor="tags">Tags</FieldLabel>
          <Input
            id="tags"
            type="text"
            name="tags"
            value={tags}
            onChange={handleInputChange}
            placeholder="marketing, ecommerce"
          />
          <FieldDescription>Comma separated</FieldDescription>
        </Field>

        {/* Field Model */}
        <Field>
          <FieldLabel htmlFor="model">Model *</FieldLabel>
          <Input
            id="model"
            type="text"
            name="model"
            value={model}
            onChange={handleInputChange}
            placeholder="gpt-4"
            className={`${errors.model ? "border-red-500 focus-visible:ring-red-300 focus-visible:border-red-500" : ""}`}
          />
          <FieldError>{errors.model}</FieldError>
        </Field>

        {/* Field Language */}
        <Field>
          <FieldLabel htmlFor="language">Language *</FieldLabel>
          <Input
            id="language"
            type="text"
            name="language"
            value={language}
            onChange={handleInputChange}
            placeholder="en"
            className={`${errors.language ? "border-red-500 focus-visible:ring-red-300 focus-visible:border-red-500" : ""}`}
          />
          <FieldError>{errors.language}</FieldError>
        </Field>

        {/* Field Author Id */}
        <Field>
          <FieldLabel htmlFor="authorId">Author ID</FieldLabel>
          <Input
            id="authorId"
            type="text"
            name="authorId"
            placeholder="XSDW1213"
            value={authorId}
            onChange={handleInputChange}
          />
        </Field>

        {/* Field Author Name */}
        <Field>
          <FieldLabel htmlFor="authorName">Author Name</FieldLabel>
          <Input
            id="authorName"
            type="text"
            name="authorName"
            placeholder="Thanapat Malikaew"
            value={authorName}
            onChange={handleInputChange}
          />
        </Field>
      </FieldGroup>
      <FieldGroup className="grid grid-cols-3 gap-4 mb-4">
        {/* Field Meta Source */}
        <Field>
          <FieldLabel htmlFor="metaSource">Meta Source</FieldLabel>
          <Input
            id="metaSource"
            type="text"
            name="metaSource"
            placeholder="meta source"
            value={metaSource}
            onChange={handleInputChange}
          />
        </Field>

        {/* Field Meta License */}
        <Field>
          <FieldLabel htmlFor="metaLicense">Meta License</FieldLabel>
          <Input
            id="metaLicense"
            type="text"
            name="metaLicense"
            placeholder="meta license"
            value={metaLicense}
            onChange={handleInputChange}
          />
        </Field>

        {/* Field Version */}
        <Field>
          <FieldLabel htmlFor="version">Meta Version</FieldLabel>
          <Input
            id="version"
            type="text"
            name="version"
            placeholder="version"
            value={version}
            onChange={handleInputChange}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
