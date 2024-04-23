Below is a Markdown (.md) document outlining the data structure for your application based on the provided database schema. This document includes descriptions of each table and their relationships, which will help in understanding and utilizing your database effectively.

---

# Database Structure Documentation

## Overview
This document outlines the structure of the database used in the MyFakeCelebrity application. The database is designed to store user information, categories for prompts, the prompts themselves, and configuration settings for individual prompts as related to users.

## Table Structures

### `users`
This table stores the basic information about the users of the application.

- **user_id** (int, primary key, auto-increment): Unique identifier for each user.
- **username** (varchar): The user's chosen username.
- **email** (varchar, unique): The user's email address. It is unique across the table to prevent duplicate accounts.
- **created_at** (timestamp): The date and time when the user account was created.
- **updated_at** (timestamp): The date and time when the user account was last updated.

### `categories`
This table holds the different categories under which prompts can be classified.

- **category_id** (int, primary key, auto-increment): Unique identifier for each category.
- **name** (varchar): The name of the category, describing the type of prompts it contains.

### `prompts`
This table contains the prompts created by users, categorized under the categories defined in the `categories` table.

- **id** (int, primary key, auto-increment): Unique identifier for each prompt.
- **user_id** (int, foreign key referencing `users.user_id`): The identifier of the user who created the prompt.
- **category_id** (int, foreign key referencing `categories.category_id`): The identifier of the category to which the prompt belongs.
- **Title** (varchar): The title of the prompt.
- **content** (text): The detailed content of the prompt.
- **created_at** (timestamp): The date and time when the prompt was created.
- **updated_at** (timestamp): The date and time when the prompt was last updated.

### `config_prompts`
This table manages specific configurations that a user might set for individual prompts.

- **id** (int, primary key): Unique identifier for each configuration entry.
- **prompt_id** (int, foreign key referencing `prompts.id`): The identifier of the prompt to which this configuration applies.
- **user_id** (int, foreign key referencing `users.user_id`): The identifier of the user to whom this configuration applies.

## Relationships
- **Users-Prompts**: One-to-many relationship from `users` to `prompts`, where a single user can create multiple prompts.
- **Categories-Prompts**: One-to-many relationship from `categories` to `prompts`, where a single category can include multiple prompts.
- **Users-Config_Prompts**: One-to-many relationship from `users` to `config_prompts`, allowing users to have multiple configurations for different prompts.
- **Prompts-Config_Prompts**: One-to-many relationship from `prompts` to `config_prompts`, indicating that a prompt can have multiple configuration settings, potentially by different users.

## Conclusion
This database structure supports the MyFakeCelebrity application by organizing users, categories, prompts, and their configurations in a relational manner. It is designed to be scalable and efficient, facilitating easy management and retrieval of data as the application grows.
