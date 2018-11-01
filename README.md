# API REST Wallet
## Description
Design of an API REST with this functionalities:
- Login
- Sign Up
- Get all users registered
- Get user info
- Get user balance
- Send money to selected user

Note: It is not necessary to download the entire project, you only need the 'docker' and 'scripts' folder
## Guideline
### Docker swarm
Start service:
```
docker stack deploy -c docker/wallet_stack.yml wallet
```
Validate service:
```
docker stack services wallet
```
Note: First init the mongodb container takes longer to start because it occupies more space than the api ones. May cause that container api cannot connect to DB on start. Remove service and start it again.
```
docker stack rm wallet
```
### API information
API restfull is now available:
 - /users                   (AUTH required)
 - /login                   (email && passwd required)
 - /signup                  (email, passwd, name, username required)
 - /user/{user_id}          (AUTH required)
 - /user/balance/{user_id}  (AUTH required)
 - /sendmoney/{idReceiver}  (AUTH required, id receiver, money to transfer)

### Test endPoints
Requirements
```
python3
```
command:
```
python3 scripts/testApi.py
```
