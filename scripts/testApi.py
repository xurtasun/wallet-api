import requests,socket

ANSII = { 'bold': '\033[1m'
        , 'black': '\033[30m', 'red': '\033[31m' , 'green': '\033[32m', 'orange': '\033[33m'
        , 'blue': '\033[34m', 'purple': '\033[35m' , 'cyan': '\033[36m', 'lightgrey': '\033[37m'
        , 'end': '\033[0m'
        , 'darkgrey': '\033[90m', 'lightred': '\033[91m', 'lightgreen': '\033[92m', 'yellow': '\033[93m'
        , 'lightblue': '\033[94m', 'pink': '\033[95m', 'lightcyan': '\033[96m'
        }
# IP address 
def get_IP(): 
    host_name = socket.gethostname() 
    return socket.gethostbyname(host_name) 
class TransactionWallet(object):
    def __init__(self,path = None, email = None, passwd = None, first_name = None, last_name = None, userName = None):
        self.path, self.email, self.passwd, self.first_name, self.last_name, self.userName = path, email, passwd, first_name, last_name, userName
        self.session = requests.Session()
        token = self.login()
        if not token: ## Login not valid -- SignUp?
            self.signUp()
        self.getBalance() ## Getting my current Balance 
        self.getUsers()   ## List Users registered with current money (Shouldn't show current money but this is a test)
        self.sendMoney()  ## Sending money to one User (Using ID to make it easier and faster to develop)
        self.getBalance() 
        self.getUsers()
    def signUp(self): ## SignUp request
        print('{} Your email is not registered, we need some information to Sign you Up. {}'.format(ANSII['lightred'],ANSII['end']))
        self.userName   = input('{}Enter your Username: {}  '.format(ANSII['bold'],ANSII['end']))
        self.first_name = input('{}Enter your First Name: {}'.format(ANSII['bold'],ANSII['end']))
        self.last_name  = input('{}Enter your Last Name: {} '.format(ANSII['bold'],ANSII['end']))
        user = {
            'email'      : self.email,
            'passwd'     : self.passwd,
            'first_name' : self.first_name,
            'last_name'  : self.last_name,
            'userName'   : self.userName
        }
        r = self.session.post('{}/signup'.format(self.path),json=user).json() ## POST / SIGN UP
        print('{}{}{}'.format(ANSII['green'],r['message'],ANSII['end']))
        self.session.headers.update({'verse-access-token' : r['token']}) ## SAVING TOKEN on HEADERs
    def login(self): ## Login request
        user = {
            'email' : self.email,
            'passwd': self.passwd
        }
        r = self.session.post('{}/login'.format(self.path),json=user).json() ## POST / LOGIN
        print('{}{}{}'.format(ANSII['green'],r['message'],ANSII['end']))
        self.session.headers.update({'verse-access-token' : r['token']}) ## SAVING TOKEN on HEADERs
        return r['token']
    def getBalance(self):
        r = self.session.get('{}/user/balance'.format(self.path)).json() ## GET / BALANCE
        self.currency = r['currency']
        self.balance  = r['balance']
        print('Your current Balance is: {} {} {} {}'.format(ANSII['blue'],r['balance'],r['currency'],ANSII['end']))
    def sendMoney(self):
        ## ASKING FOR MONEY RECEIVER AND QUANTITY
        identifier = input('{}Email whose gonna receive your money: {}'.format(ANSII['bold'],ANSII['end']))
        money = input('{}How much money wanna send to it [{}]: {}'.format(ANSII['bold'],self.currency,ANSII['end']))
        data = {
            'money' : int(money)
        }
        r = self.session.post('{}/send/{}'.format(self.path,identifier),json=data).json() ## POST / SENDMONEY
        if not r.get('user'):
            print('{}{}{}'.format(ANSII['red'],r['message'],ANSII['end'])) ## IF NOT ENOUGH BALANCE
        else:
            print('{}{}{}'.format(ANSII['green'],r['message'],ANSII['end'])) ## IF TRANSACTION SUCCEED

    def getUsers(self):
        r = self.session.get('{}/users/'.format(self.path)).json() ## GET / LIST USERS REGISTERED
        print('{}Select the identifier of user to send Money: {}'.format(ANSII['bold'],ANSII['end']))
        for user in r:
            print('{}{:25}{} - {:10} {:10} {} {:3} {} {}'.format(ANSII['orange'],user['_id'],ANSII['end'],user['name']['first'],user['name']['last'],ANSII['green'],user['balance'],user['currency'],ANSII['end']))


if __name__ == '__main__':

    print('{}Welcome to your Personal Wallet. {}'.format(ANSII['lightblue'],ANSII['end']))
    email = input('{}Enter your email: {}'.format(ANSII['bold'],ANSII['end']))
    passwd = input('{}Enter your password: {}'.format(ANSII['bold'],ANSII['end']))
    ip = get_IP()
    vrs = TransactionWallet( path = 'http://{}:443'.format(ip), ##Default API - endPoint
                             email = email,
                             passwd = passwd,
                            )

