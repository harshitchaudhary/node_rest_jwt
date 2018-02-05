# Instructions Simple REST JWT based node app
##### Endpoint 1: (Creates an user) 
_url: localhost:8000/user_
_method: POST_
_body: username, password, email_

##### Endpoint 2: (Login user and generates a JWT token)
_url: localhost:8000/login_
_method: POST_
_body: username, password_

##### Endpoint 3: (List all of the users)
_url: localhost:8000/user_
_method: GET_
_headers: x-access-token_ (Token received from login)

##### Endpoint 4: (List an user)
_url: localhost:8000/user/:id_
_method: GET_
