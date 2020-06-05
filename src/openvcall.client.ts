export class OpenVCallClient {

    openTok: any = require('@opentok/client')
    apiKey: string = ""
    secretKey: string = ""
    sessionId: string = ""
    token: string = ""
    session: any = null
    publisher: any = null

    constructor(apiKey: string, secretKey: string, sessionId: string, token: string, pubTagId: string, subTagId: string) {
        this.apiKey = apiKey
        this.secretKey = secretKey
        this.sessionId = sessionId
        this.token = token
        this.session = this.openTok.initSession(apiKey, sessionId)
        this._initSubscriber(subTagId)
        this._initPublisher(pubTagId)
    }

    _initPublisher(tagId: string) {
        this.publisher = this.openTok.initPublisher(tagId, {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        }, function (error: any) {
            error ? console.log(error.message) : "";
        })
    }

    _initSubscriber(tagId: string) {
        var self = this
        this.session.on('streamCreated', function (event: any) {
            self.session.subscribe(event.stream, tagId, {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            }, function (error: any) {
                error ? console.log(error.message) : "";
            })
        })
    }

    showShareScreen() {
        var self = this
        this.openTok.checkScreenSharingCapability(function (response: any) {
            if (!response.supported || response.extensionRegistered === false) {
                console.log("Browser doesn't support screen sharing.");
            } else if (response.extensionInstalled === false) {
                console.log("Please install extension.");
            } else {
                var publishOptions: any = {};
                publishOptions.maxResolution = { width: 1920, height: 1080 };
                publishOptions.videoSource = 'screen';
                var screenPublisherElement = document.createElement('div');
                var publisher = self.openTok.initPublisher(screenPublisherElement, publishOptions,
                    function (error: any) {
                        if (error) {

                        } else {
                            self.session.publish(publisher, function (error: any) {
                                if (error) {

                                }
                            });
                        }
                    }
                );
            }
        });
    }

    connect() {
        var self = this
        this.session.connect(this.token, function (error: any) {
            if (error) {
                console.log(error.message)
            } else {
                self.session.publish(self.publisher, function (error: any) {
                    error ? console.log(error.message) : "";
                });
            }
        })
    }
}

window.onload = function() {
    var url = new URL(window.location.href)
    var sessionId = url.searchParams.get("sessionId")
    var token = url.searchParams.get("token")
    var openVcall = new OpenVCallClient("45992642", "c071e1e9cb983752fea257416b17e03209796a12",
        sessionId, token, "publisher", "subscriber")
    openVcall.connect()
}