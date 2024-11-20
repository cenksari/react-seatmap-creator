import React from 'react';

// interfaces
interface IProps {
  text?: string;
  preview?: boolean;
  editStageName?: (name: string) => void;
}

interface IFormProps {
  name: string;
}

const Stage = ({ text, preview, editStageName }: IProps): React.JSX.Element => {
  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [formValues, setFormValues] = React.useState<IFormProps>({
    name: text || '',
  });

  /**
   * Handles the form submission event by preventing the default action.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The event object from the form submission.
   */
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name } = formValues;

    if (!name || name.trim() === '') return;

    editStageName?.(name);

    setEditMode(false);
  };

  return (
    <div className='flex flex-gap-medium flex-v-center flex-h-center stage'>
      {editMode ? (
        <form
          noValidate
          onSubmit={handleOnSubmit}
          className='flex flex-gap-medium flex-v-center flex-h-center'
        >
          <input
            id='name'
            type='text'
            name='mapName'
            autoComplete='off'
            value={formValues.name}
            placeholder='Enter seat map name'
            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
          />
          <button
            type='submit'
            className='button black flex flex-gap-small flex-v-center flex-h-center'
          >
            Update
          </button>
          <button
            type='button'
            onClick={() => setEditMode(false)}
            className='button gray flex flex-gap-small flex-v-center flex-h-center'
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          {text}
          {!preview && (
            <button
              type='button'
              onClick={() => setEditMode((prev) => !prev)}
              className='button flex flex-v-center flex-h-center'
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Stage;
