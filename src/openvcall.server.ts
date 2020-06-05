export class OpenVCallServer {

    OT = require('opentok')
    apiKey: string = ""
    secretKey: string = ""
    opentok: any = null

    constructor(apiKey: string, secretKey: string) {
        this.apiKey = apiKey
        this.secretKey = secretKey
        this.opentok = new this.OT(apiKey, secretKey)
    }

    createSesion(completion: (sessionId: string, token: string) => void) {
        var self = this
        this.opentok.createSession(function (err: any, session: any) {
            if (err) return console.log(err);
            completion(session.sessionId, self.opentok.generateToken(session.sessionId))
        })
    }
}

window.onload = function() {
    var main = new OpenVCallServer("45992642", "c071e1e9cb983752fea257416b17e03209796a12")
    main.createSesion(function (sessionId, token) {
        let inviteLink = document.getElementById("invite-link") as HTMLInputElement
        inviteLink.value = window.location.protocol + "//" + window.location.host + "/live.html?sessionId=" + sessionId + "&token=" + token
    })
}