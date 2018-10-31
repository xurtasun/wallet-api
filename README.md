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
docker stack deploy -c docker/wallet_stack.yml wallet
```
### API information
API restfull is now available:
 - /users                   (auth required)
 - /login                   
 - /signup
 - /user                    (auth required)
 - /user/balance            (auth required)
 - /sendmoney/:idReceiver   (auth required)

### Test endPoints
Requirements
```
python3
```
command:
```
python3 scripts/testApi.py
```
