# API REST Wallet
## Description
Design of an API REST with this functionalities:
- Login
- Sign Up
- Get all users registered
- Get user info
- Get user balance
- Send money to selected user

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
### API information
API restfull is now available:
 - /users                   (auth required)
 - /login                   (email && passwd required)
 - /signup                  (email, passwd, name, username required)
 - /user                    (auth required)
 - /user/balance            (auth required)
 - /sendmoney/:idReceiver   (auth required, id receiver, money to transfer)

### Test endPoints
Requirements
```
python3
```
command:
```
python3 scripts/testApi.py
```
