//since we are going to have our errors and it's status therefore we use some variables here
//to knpw what's going on in our backend api

class ErrorResponse extends Error{
    constructor(message, codeStatus){
        super(message);
        this.codeStatus=codeStatus;
    }
}

module.exports = ErrorResponse; //in order to use it in our files we need to export it

