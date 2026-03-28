import Heading from '../typography/Heading';
import { Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

export default function PromptCustomize({ prompt, values, setValues }) {
  const { variables } = prompt;
  const finalVariables = variables || [];

  return (
    <section className="bg-white p-6 border border-gray-300 rounded-xl shadow-lg flex flex-col gap-4">
      <Heading level="3">Customize</Heading>

      <div className="grid md:grid-cols-2 gap-4">
        {finalVariables.map((varObj) => {
          const name = varObj?.name || '';
          const placeholder = varObj?.placeholder || name;
          const type = varObj?.type || 'text';

          const inputType = type === 'string' ? 'text' : type;

          return (
            <Field key={name}>
              <FieldLabel htmlFor={name}>
                {name} {varObj?.required ? ' *' : ''}
              </FieldLabel>
              <Input
                id={name}
                name={name}
                type={inputType}
                value={values[name] || ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [name]: e.target.value,
                  }))
                }
                placeholder={placeholder}
                required={!!varObj?.required}
              />
            </Field>
          );
        })}
      </div>
    </section>
  );
}
