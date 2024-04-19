import React from 'react';

function EditPromptPage() {
  return (
    <div>
      <h1>Edit Prompt</h1>
      <form>
        <label>
          Prompt Title:
          <input type="text" name="title" />
        </label>
        <label>
          Prompt Description:
          <textarea name="description" />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditPromptPage;
