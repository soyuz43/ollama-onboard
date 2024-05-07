#### File Tree

* **App.css**
* **App.jsx**
* **assets**
	+ **react.svg**
* **components**
	+ **auth**
	+ **ConfirmationPage.jsx**
	+ **Layout.jsx**
	+ **MessageInputForm.jsx**
	+ **MessageList.jsx**
	+ **persistant**
	+ **StylesComponent**
* **docs**
	+ **InternalDocs**
* **hooks**
	+ **useChat.js**
* **index.css**
* **main.jsx**
* **pages**
	+ **CategoriesPage.jsx**
	+ **chat**
	+ **CreatePromptPage.jsx**
	+ **EditPage.jsx**
	+ **HomePage.jsx**
	+ **pageStyles**
	+ **ProfilePage.jsx**
	+ **prompts**
* **services**
	+ **categoryService.jsx**
	+ **chatService**
	+ **promptService.jsx**
	+ **userService.jsx**
* **Styles__Master**
	+ **fonts**
	+ **master.css**
* **views**
	+ **ApplicationViews.jsx**
	+ **Authorized.jsx**

### `src/` Directory
This is the root directory of the source code, containing all the JavaScript and React components, services, and styles.

#### `main.jsx`
The entry point for the React application. It sets up the root React DOM and wraps the entire `<App>` component with `<BrowserRouter>` for routing.

#### `App.jsx`
Defines the main React component that handles the routing setup. It utilizes `BrowserRouter` and `Routes` from `react-router-dom` to define the navigation structure of the application.

### `components/` Directory
Contains reusable components that can be used throughout the application.

#### `Layout.jsx`
Defines the main layout of the application, including the `<Header>` and the `<Footer>`, and an `<Outlet>` for nested routes.

#### `Header.jsx`
Presents the top navigation bar and includes links for navigation across the site. It handles the login state to toggle the display between login and logout.

#### `Footer.jsx`
Displays the footer across the application, providing copyright information.

#### `MessageList.jsx`
Renders a list of messages, particularly used in the chat feature of the application.

#### `MessageInputForm.jsx`
Defines a form for inputting messages in the chat, handling submission and state updates for user input.

### `hooks/` Directory
Contains custom React hooks to encapsulate specific logic or functionality that can be shared across components.

#### `useChat.js`
Manages chat functionalities such as adding new messages and updating assistant messages in state.

### `pages/` Directory
Hosts the components that are mapped to routes and represent entire pages within the application.

#### `HomePage.jsx`
Serves as the landing page of the application, providing links to other parts of the site like prompts and profiles.

#### `ProfilePage.jsx`
Displays user-specific information such as email, creation date, and allows for user profile operations like editing and deleting.

#### `PromptsPage.jsx`
Lists all prompts with options to filter, search, and select prompts based on categories or ownership.

#### `PromptActionsPage.jsx`
Allows users to interact with prompts (view, edit, delete) based on user ownership.

#### `PromptView.jsx`
Displays detailed information for a single prompt, retrieved by ID.

#### `CategoriesPage.jsx`
Lists different categories of prompts, allowing users to navigate prompts grouped by categories.

#### `CreatePromptPage.jsx`
Provides a form for creating a new prompt, including title, content, and category.

#### `EditPage.jsx`
Allows editing of an existing prompt, with functionalities to update or delete the prompt.

#### `ChatPage.jsx`
Integrates a chat interface allowing users to send messages and view responses, also includes sidebar toggles for additional functionalities like viewing prompts.

#### `ModelList.jsx`
Displays a list of models fetched from an external API, with functionalities to show or hide details about each model.

#### `ConfirmationPage.jsx`
Displays a confirmation message after an action has been completed, such as creating or editing a prompt, with a navigation timeout.

### `services/` Directory
Contains modules that handle fetching data from the backend, abstracting the API calls.

#### `promptService.js`
Handles API requests related to prompts (fetching, creating, updating, deleting).

#### `userService.js`
Manages API requests related to users (fetching, creating, deleting).

#### `categoryService.js`
Facilitates fetching categories from the backend.

#### `chatService/`
Includes services related to the chat functionality.

- `OllamaAPIService.jsx`: Fetches responses for chat messages.
- `ConversationService.js`: Manages saving and retrieving chat conversations.

### `views/` Directory
This contains components that are used within the `<Routes>` defined in `App.jsx`, managing the layout and routing for various features.

#### `AppViews.jsx`
Central component that imports and renders routes for all major features of the application like home, profiles, prompts, and chat.

### Styles
CSS and CSS modules for styling components and pages are stored adjacent to their respective React components in a `pageStyles/` or directly within component folders.

This documentation should provide a clear roadmap for new developers to understand the architectural setup and functionality distribution across the codebase, facilitating quicker and more efficient onboarding.