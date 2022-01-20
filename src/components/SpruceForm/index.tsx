import Form, { FormProps } from "@rjsf/core";
import { SpruceFormContainer } from "./Container";
import { transformErrors } from "./Errors";
import baseFields from "./Fields";
import { ArrayFieldTemplate, DefaultFieldTemplate } from "./FieldTemplates";
import widgets from "./Widgets";

export type FormDataProps = FormProps<any>["formData"];

export type SpruceFormProps = Pick<
  FormProps<any>,
  "schema" | "onChange" | "formData"
> &
  Partial<FormProps<any>>;

export const SpruceForm: React.FC<SpruceFormProps> = ({
  schema,
  onChange,
  uiSchema,
  formData,
  fields,
  tagName,
  validate,
  customFormats,
}) => (
  <Form
    fields={{ ...baseFields, ...fields }}
    schema={schema}
    onChange={onChange}
    widgets={widgets}
    uiSchema={uiSchema}
    formData={formData}
    tagName={tagName}
    ArrayFieldTemplate={ArrayFieldTemplate}
    FieldTemplate={DefaultFieldTemplate}
    transformErrors={transformErrors}
    showErrorList={false}
    validate={validate}
    customFormats={customFormats}
    liveValidate
  >
    {/*  Need to pass in an empty fragment child to remove default submit button */}
    <></>
  </Form>
);

export { SpruceFormContainer };