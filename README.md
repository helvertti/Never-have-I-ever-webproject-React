# Never-have-I-ever-webproject-React
Webproject made with Javascript React.

  
Rest calls

‘/neverever’ – GET/ List all prompts.
‘/neverever/:id’ – DELETE/ Delete one specific prompt with specified id.
‘/neverever/add’ – POST/ Add new prompt to database. [user_name, statement]
‘/users/this’ – POST/ Checks if user’s name and password match with database. [user_name, user_password]
‘/users/info’ – POST/ Get user information with given name. Returns true or false. [user_name]
‘/users/infos’ – POST/ Get user information with given name. Returns user data. [user_name]
‘/users/:id’ – GET/ Get specific user information with specified id.
‘/users/add’ – POST/ Add new user to database. [user_id, user_name]
‘/login’ – POST/ Saves the token. [token, user_id, user_name]
‘/users/username/update’ – PUT/ Updates users username. [user_id, user_name]
‘/users /update’ – PUT/ Updates users password. [user_id, new_password]
