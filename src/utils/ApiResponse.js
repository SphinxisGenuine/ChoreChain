

class Apiresponse{
    constructor(statuscode,data,message="Succes"){
        this.statuscode=statuscode,
        this.data=data,
        this.message=message,
        this.succes=statuscode<400


    }
}
export {Apiresponse};