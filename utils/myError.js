//ulamjlalt error-iig ashiglan aldaa garval aldaani msj, dugaar butsaadag 
class MyError extends Error {
    constructor(message, statusCode){
        //aldaani msj
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = MyError;