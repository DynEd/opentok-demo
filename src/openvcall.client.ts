import * as OpenTok from "@opentok/client"

export default class OpenVCallClient {

    _currentScreenShareId: string = "screen-share-stream"
    _screenShareElement: HTMLDivElement
    _subContainerElement: HTMLDivElement
    _archiveId: string

    apiKey: string
    token: string
    sessionId: string
    localUserTagId: string
    subscribersTagId: string
    screenShareTagId: string

    session: OpenTok.Session
    localUser: OpenTok.Publisher

    constructor(apiKey: string, sessionId: string, localUserTagId: string, subscribersTagId: string, screenShareTagId: string) {
        this.apiKey = apiKey
        this.sessionId = sessionId
        this.localUserTagId = localUserTagId
        this.subscribersTagId = subscribersTagId
        this.screenShareTagId = screenShareTagId
        this._subContainerElement = document.getElementById(this.subscribersTagId) as HTMLDivElement
        this._screenShareElement = document.getElementById(this.screenShareTagId) as HTMLDivElement
        this.session = OpenTok.initSession(apiKey, sessionId)
    }

    connect(token: string) {
        this.token = token
        this._initSubscribers()
        this.localUser = OpenTok.initPublisher(this.localUserTagId, {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        }, this._onError)

        this._initStopShareScreen()
        this.session.connect(token, error => {
            if (error) {
                console.log(error)
            } else {
                this.session.publish(this.localUser, this._onError);
                this._requestStartArchiving(this.sessionId)
            }
        })
    }

    disconnect() {
        this.session.off();
        this.session.disconnect();
        this.session.unpublish(this.localUser)
        this.localUser.destroy();
        this._subContainerElement.innerHTML = ""
    }

    startShareScreen() {
        OpenTok.checkScreenSharingCapability(response => {
            if (!response.supported || response.extensionRegistered === false) {
                alert("Browser doesn't support screen sharing.");
            } else if (response.extensionInstalled === false) {
                alert("Please install extension.");
            } else {
                var publishOptions: OpenTok.PublisherProperties = {
                    maxResolution: { width: 1920, height: 1080 },
                    videoSource: "screen"
                };

                var currentScreenShareElement = document.createElement('div');
                currentScreenShareElement.id = this._currentScreenShareId

                // this._screenShareElement.appendChild(currentScreenShareElement)
                var publisher = OpenTok.initPublisher(currentScreenShareElement, publishOptions, error => {
                    if (error) {
                        console.log(error)
                    } else {
                        this.session.publish(publisher, this._onError);
                        currentScreenShareElement.style.zIndex = "11"
                        currentScreenShareElement.style.width = "100%"
                        currentScreenShareElement.style.height = "100%"
                    }
                });
            }
        });
    }

    _onError(error: OpenTok.OTError) {
        console.log(error)
    }

    _initSubscribers() {
        this.session.on('streamCreated', event => {
            if (event.stream.videoType === 'screen') {

                var currentScreenShareElement = document.createElement('div');
                currentScreenShareElement.id = this._currentScreenShareId

                this._screenShareElement.appendChild(currentScreenShareElement)
                this.session.subscribe(event.stream, this._currentScreenShareId, {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%'
                }, this._onError)

                currentScreenShareElement.style.zIndex = "11"
                currentScreenShareElement.style.width = "100%"
                currentScreenShareElement.style.height = "100%"
                currentScreenShareElement.style.position = "absolute"
                this._subContainerElement.id = "anim-subscribers"
            } else {
                this._addSubscriberView(event.stream.streamId)
                this.session.subscribe(event.stream, event.stream.streamId, {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%'
                }, this._onError)
            }
        })

        this.session.on("streamDestroyed", event => {
            document.getElementById(event.stream.streamId).remove()
        })

        this.session.on("sessionDisconnected", event => {
            this._subContainerElement.innerHTML = ""
            document.getElementById(this._currentScreenShareId).remove()
            this._requestStopArchiving(this._archiveId)
        });
    }

    _initStopShareScreen() {
        this.session.on('mediaStopped', event => {
            this._subContainerElement.id = this.subscribersTagId
        })

        this.session.on('streamDestroyed', event => {
            this._subContainerElement.id = this.subscribersTagId
        })
    }

    _addSubscriberView(id: string) {
        var subscriber = document.createElement("div") as HTMLDivElement
        subscriber.id = id
        this._subContainerElement.appendChild(subscriber)
        if (this._subContainerElement.childNodes.length > 1) {
            this._subContainerElement.style.gridTemplateColumns = "1fr 1fr"
        } else {
            this._subContainerElement.style.gridTemplateColumns = "1fr"
        }
    }

    _removeSubscriberView(id: string) {
        document.getElementById(id).remove()
        if (this._subContainerElement.childNodes.length > 1) {
            this._subContainerElement.style.gridTemplateColumns = "1fr 1fr"
        } else {
            this._subContainerElement.style.gridTemplateColumns = "1fr"
        }
    }

    _requestStartArchiving(sessionId: string) {
        var archiveOptions = {
            "sessionId": sessionId,
            "hasAudio": true,
            "hasVideo": true,
            "outputMode": "composed",
            "resolution": "640x480",
        };
        var xhttp = new XMLHttpRequest();
        var url = "https://api.opentok.com/v2/project/" + this.apiKey + "/archive"
        var self = this
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(xhttp.responseText);
                self._archiveId = json.id;
            }
        }
        xhttp.open("POST", url, true)
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("X-OPENTOK-AUTH", this.token);
        xhttp.send(JSON.stringify(archiveOptions))
    }

    _requestStopArchiving(archiveId: string) {
        var xhttp = new XMLHttpRequest();
        var url = "https://api.opentok.com/v2/project/" + this.apiKey + "/archive/" + archiveId + "/stop"
        var self = this
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(xhttp.responseText);
                self._archiveId = json.id;
            }
        }
        xhttp.open("POST", url, true)
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("X-OPENTOK-AUTH", this.token);
        xhttp.send()
    }
}
(window as any).OpenVCallClient = OpenVCallClient