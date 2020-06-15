import * as OpenTok from "@opentok/client"

export class OpenVCallClient {

    _subContainerElement: HTMLDivElement

    apiKey: string
    sessionId: string
    localUserTagId: string
    subscribersTagId: string

    session: OpenTok.Session
    localUser: OpenTok.Publisher

    constructor(apiKey: string, sessionId: string, localUserTagId: string, subscribersTagId: string) {
        this.apiKey = apiKey
        this.sessionId = sessionId
        this.localUserTagId = localUserTagId
        this.subscribersTagId = subscribersTagId
        this._subContainerElement = document.getElementById(this.subscribersTagId) as HTMLDivElement
        this.session = OpenTok.initSession(apiKey, sessionId)
    }

    connect(token: string) {
        this._initSubscribers()
        this.localUser = OpenTok.initPublisher(this.localUserTagId, {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        }, this._onError)

        this.session.connect(token, error => {
            if (error) {
                console.log(error.message)
            } else {
                this.session.publish(this.localUser, this._onError);
            }
        })
    }

    disconnect() {
        this.session.disconnect()
    }

    _onError(error: OpenTok.OTError) {
        console.log(error.message)
    }

    _initSubscribers() {
        this.session.on('streamCreated', event => {
            this._addSubscriberView(event.stream.streamId)
            this.session.subscribe(event.stream, event.stream.streamId, {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            }, this._onError)
        })

        this.session.on("sessionDisconnected", event => {
            this._subContainerElement.innerHTML = ""
        });
    }

    _addSubscriberView(id: string) {
        var subscriber = document.createElement("div") as HTMLDivElement
        subscriber.id = id
        this._subContainerElement.appendChild(subscriber)
        if (this._subContainerElement.childElementCount > 1) {
            this._subContainerElement.style.gridTemplateColumns = "1fr 1fr"
        } else {
            this._subContainerElement.style.gridTemplateColumns = "1fr"
        }
    }

    _removeSubscriberView(id: string) {
        document.getElementById(id).remove()
        if (this._subContainerElement.childElementCount > 1) {
            this._subContainerElement.style.gridTemplateColumns = "1fr 1fr"
        } else {
            this._subContainerElement.style.gridTemplateColumns = "1fr"
        }
    }

    showShareScreen() {
        var self = this
        OpenTok.checkScreenSharingCapability(function (response: any) {
            if (!response.supported || response.extensionRegistered === false) {
                console.log("Browser doesn't support screen sharing.");
            } else if (response.extensionInstalled === false) {
                console.log("Please install extension.");
            } else {
                var publishOptions: any = {};
                publishOptions.maxResolution = { width: 1920, height: 1080 };
                publishOptions.videoSource = 'screen';
                var screenPublisherElement = document.createElement('div');
                var publisher = OpenTok.initPublisher(screenPublisherElement, publishOptions,
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
}

window.onload = function() {
    var url = new URL(window.location.href)
    var token = url.searchParams.get("token")
    var sessionId = url.searchParams.get("sessionId")
    var openVcall = new OpenVCallClient("45992642", sessionId, "local-user", "subscribers")
    openVcall.connect(token)
}