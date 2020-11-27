# Chatoyant-back
****
NodeJs with express back-end server.
Persistency with MongoDB cloud.

# Starting server
****
Docker solution :
````
Linux: 		docker-compose build && docker-compose up
Windows powershell: 	docker-compose build; docker-compose up
````
								
								

Node solution :	node app.js

# Routes
****
Data received via JSON format.

Create user
````
/api/auth/signup
format:
{
	username,
	email,
	password
}
````

Authentify user
````
/api/auth/signin
format:
{
	usersname,
	password
}
````

Check user permissions
````
/api/test/user
format:
{
	email
}
````

Check admin permissions
````
/api/test/admin
format:
{
	email
}
````
