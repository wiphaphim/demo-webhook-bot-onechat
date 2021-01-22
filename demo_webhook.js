const express = require('express')
const bodyParser = require('body-parser') 
const cors = require('cors')
const axios = require('axios');
const Onechat = require("./dbConfig")

const app = express()

app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('*', (req, res) => {
    res.send("test webhook onechat")
})

const responseUser = async(url, playload) => {
    let config = {
        method: 'post',
        url: url,
        headers: { 
            'Authorization': 'Bearer Afa48433443b75789b529a8fcef1b4eff295a28438b524eec8ccdb3855a95a311ff240b8d6733489fa86fc17ded6c9719', 
            'Content-Type': 'application/json'
        },
        data : playload
        };
    let result = await axios(config)
    .catch(error => console.log(error))
    console.log("result ===>", result.data);
    
}

const bothook = async(req, res) => {
    try {
        console.log("req.body ===>", req.body);
        let user_id = req.body.source.user_id
        console.log("user_id ===>", user_id);
        let bot_id = req.body.bot_id
        console.log("bot_id ===>", bot_id);
        console.log("message ===>", req.body.message.text);

        let url = ''
        let playload = ''

        if (req.body.message.text === 'device_list') {
            console.log(">>>>>>>>>>>>>>>> device list <<<<<<<<<<<<<<<<<<");

            playload = JSON.stringify({
                "to":user_id,
                "bot_id": bot_id,
                "type": "template",
                "custom_notification": "เปิดอ่านข้อความใหม่จากทางเรา",
                "elements": [
                    {
                        "image": "https://cdn.jim-nielsen.com/ios/512/bluetooth-ble-device-finder-2020-02-10.png",
                        "title": "Home",
                        "detail": "Door",
                        "choice": [
                            {
                                "label" : "access divice",
                                "type" : "webview",
                                "url" : "https://web-ble-sample.herokuapp.com/index.html",
                                "size" : "full",
                                "sign" : "true",
                                "onechat_token" : "true"
                            }
                        ]
                    },
                    {
                        "image": "https://www.centare.com/static/0512613b9c263baddd3213b37494eaa9/26df7/ble-app-icon.png",
                        "title": "Office",
                        "detail": "Door",
                        "choice": [
                            {
                                "label" : "access divice",
                                "type" : "webview",
                                "url" : "https://web-ble-sample.herokuapp.com/index.html",
                                "size" : "full",
                                "sign" : "true",
                                "onechat_token" : "true"
                            }
                        ]
                    }
                ]
            })
            
            url =  'https://chat-api.one.th/message/api/v1/push_message'

            await responseUser(url, playload)

            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "message" : "ต้องการทำรายการอื่นหรือไม่",
                "quick_reply" : [  
                    {
                        "label" : "ใช่",
                        "type" : "text",
                        "message" : "ใช่",
                        "payload" : "ใช่"
                    },
                    {
                        "label" : "ไม่",
                        "type" : "text",
                        "message" : "ไม่",
                        "payload" : "ไม่"
                    },
                ]
            });
        
            url = 'https://chat-api.one.th/message/api/v1/push_quickreply'

        } else if (req.body.message.text === 'device_name') {
            console.log(">>>>>>>>>>>>>>>> device_name <<<<<<<<<<<<<<<<<<");
            playload = JSON.stringify({
                "bot_id": bot_id,
                "to": user_id,
                "elements": [
                    {
                        "type" : "text",
                        "image" : "data:image/png;base64,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",
                        "action" : "Device01",
                        "payload" : "Device01",
                        "sign" : "false",
                        "onechat_token" : "false",
                        "button" : "Device01"
                      },
                      {
                        "type" : "text",
                        "image" : "https://www.centare.com/static/0512613b9c263baddd3213b37494eaa9/26df7/ble-app-icon.png",
                        "action" : "Device02",
                        "payload" : "Device02",
                        "sign" : "false",
                        "onechat_token" : "false",
                        "button" : "Device02"
                      }
                ]
            })
            url = "https://chat-api.one.th/bot-message/api/v1/image-carousel"

        } else if (req.body.message.text === 'Device01') {
            console.log(">>>>>>>>>>>>>>>> Device01 <<<<<<<<<<<<<<<<<<");
            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "type" : "text",
                "message" : 'infomation of Device01',
                "custom_notification" : "Device01"
            });
            
            url =  'https://chat-api.one.th/message/api/v1/push_message'

            await responseUser(url, playload)

            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "message" : "ต้องการทำรายการอื่นหรือไม่",
                "quick_reply" : [  
                    {
                        "label" : "ใช่",
                        "type" : "text",
                        "message" : "ใช่",
                        "payload" : "ใช่"
                    },
                    {
                        "label" : "ไม่",
                        "type" : "text",
                        "message" : "ไม่",
                        "payload" : "ไม่"
                    },
                ]
            });
        
            url = 'https://chat-api.one.th/message/api/v1/push_quickreply'
        
        } else if (req.body.message.text === 'Device02') {
            console.log(">>>>>>>>>>>>>>>> Device02 <<<<<<<<<<<<<<<<<<");
            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "type" : "text",
                "message" : 'infomation of Device02',
                "custom_notification" : "Device02"
            });
            
            url =  'https://chat-api.one.th/message/api/v1/push_message'

            await responseUser(url, playload)

            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "message" : "ต้องการทำรายการอื่นหรือไม่",
                "quick_reply" : [  
                    {
                        "label" : "ใช่",
                        "type" : "text",
                        "message" : "ใช่",
                        "payload" : "ใช่"
                    },
                    {
                        "label" : "ไม่",
                        "type" : "text",
                        "message" : "ไม่",
                        "payload" : "ไม่"
                    },
                ]
            });
        
            url = 'https://chat-api.one.th/message/api/v1/push_quickreply'


        } else if (req.body.message.text === 'history') {
            console.log(">>>>>>>>>>>>>>>> history <<<<<<<<<<<<<<<<<<");
            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "type" : "text",
                "message" : 'ไม่มีประวัติ',
                "custom_notification" : "history"
            });
            
            url =  'https://chat-api.one.th/message/api/v1/push_message'

            await responseUser(url, playload)

            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "message" : "ต้องการทำรายการอื่นหรือไม่",
                "quick_reply" : [  
                    {
                        "label" : "ใช่",
                        "type" : "text",
                        "message" : "ใช่",
                        "payload" : "ใช่"
                    },
                    {
                        "label" : "ไม่",
                        "type" : "text",
                        "message" : "ไม่",
                        "payload" : "ไม่"
                    }
                ]
            });
        
            url = 'https://chat-api.one.th/message/api/v1/push_quickreply'

        
        } else if (req.body.message.text === 'ไม่') {
            console.log(">>>>>>>>>>>>>>>> no <<<<<<<<<<<<<<<<<<");
            playload = {
                "user_id" : user_id,
                "bot_id" : bot_id
            }
            url = "https://chat-api.one.th/alpine/api/v1/switchKeyboard"
        } else {
            playload = JSON.stringify({
                "to": user_id,
                "bot_id": bot_id,
                "message" : "คุณต้องการทำรายการใด",
                "quick_reply" : [  
                    {
                        "label" : "Device list",
                        "type" : "text",
                        "message" : "device_list",
                        "payload" : "Device"
                    },
                    {
                        "label" : "Device name",
                        "type" : "text",
                        "message" : "device_name",
                        "payload" : "Device"
                    },
                    {
                        "label" : "History",
                        "type" : "text",
                        "message" : "history",
                        "payload" : "History"
                    },
                    {
                        "label" : "เลือกรูปภาพ",
                        "type" : "image",
                        "payload" : "Register"
                    }
                ]
            });
    
            url = 'https://chat-api.one.th/message/api/v1/push_quickreply'
        }

        await responseUser(url, playload)

        res.send("test webhook onechat ")

    } catch (err) {
        console.log(err);    
    }
}

app.post('/', bothook)

//>>>>>>>>>>>>> แบบ promise function

// app.post('/', (req, res) => {
//     try {
//         console.log("req.body ===>", req.body);
//         let user_id = req.body.source.user_id
//         console.log("user_id ===>", user_id);
//         let bot_id = req.body.bot_id
//         console.log("bot_id ===>", bot_id);
//         console.log("message ===>", req.body.message.text);

//         let url = ''
//         let data = ''

//         if (req.body.message.text === 'device_list') {
//             let playload = JSON.stringify({
//                 "to": user_id,
//                 "bot_id": bot_id,
//                 "type" : "text",
//                 "message" : '[{devie:"efeagrfgereagredfgdfgagreg", token:"afaerferfergfergre", name:"diveci01"}]',
//                 "custom_notification" : "Your deivce list"
//             });
            
//             let config = {
//                 method: 'post',
//                 url: 'https://chat-api.one.th/message/api/v1/push_message',
//                 headers: { 
//                     'Authorization': 'Bearer Afa48433443b75789b529a8fcef1b4eff295a28438b524eec8ccdb3855a95a311ff240b8d6733489fa86fc17ded6c9719', 
//                     'Content-Type': 'application/json'
//                 },
//                 data : playload
//                 };
    
//             axios(config)
//                 .then((response) => console.log("response devide ===>", response.data))
//                 .catch((error) => console.log(error));

//             data = JSON.stringify({
//                 "to": user_id,
//                 "bot_id": bot_id,
//                 "message" : "ต้องการทำรายการอื่นหรือไม่",
//                 "quick_reply" : [  
//                     {
//                         "label" : "yes",
//                         "type" : "text",
//                         "message" : "yes",
//                         "payload" : "yes"
//                     },
//                     {
//                         "label" : "no",
//                         "type" : "text",
//                         "message" : "no",
//                         "payload" : "no"
//                     },
//                 ]
//             });

//             url = 'https://chat-api.one.th/message/api/v1/push_quickreply'
    

//         } else if (req.body.message.text === 'history') {
//             console.log("in history menu");
//             let playload = JSON.stringify({
//                 "to": user_id,
//                 "bot_id": bot_id,
//                 "type" : "text",
//                 "message" : 'histotry of device nothing',
//                 "custom_notification" : "history"
//             });
            
//             let config = {
//                 method: 'post',
//                 url: 'https://chat-api.one.th/message/api/v1/push_message',
//                 headers: { 
//                     'Authorization': 'Bearer Afa48433443b75789b529a8fcef1b4eff295a28438b524eec8ccdb3855a95a311ff240b8d6733489fa86fc17ded6c9719', 
//                     'Content-Type': 'application/json'
//                 },
//                 data : playload
//                 };
    
//             axios(config)
//                 .then((response) => console.log("response history ===>", response.data))
//                 .catch((error) => console.log(error));

//             data = JSON.stringify({
//                 "to": user_id,
//                 "bot_id": bot_id,
//                 "message" : "ต้องการทำรายการอื่นหรือไม่",
//                 "quick_reply" : [  
//                     {
//                         "label" : "yes",
//                         "type" : "text",
//                         "message" : "yes",
//                         "payload" : "yes"
//                     },
//                     {
//                         "label" : "no",
//                         "type" : "text",
//                         "message" : "no",
//                         "payload" : "no"
//                     },
//                 ]
//             });
    
//             url = 'https://chat-api.one.th/message/api/v1/push_quickreply'

//         } else if (req.body.message.text === 'no') {
//             data = {
//                 "user_id" : user_id,
//                 "bot_id" : bot_id
//             }
//             url = "https://chat-api.one.th/alpine/api/v1/switchKeyboard"
//         } else {
//             data = JSON.stringify({
//                 "to": user_id,
//                 "bot_id": bot_id,
//                 "message" : "คุณต้องการทำรายการใด",
//                 "quick_reply" : [  
//                     {
//                         "label" : "รายการ Device",
//                         "type" : "text",
//                         "message" : "device_list",
//                         "payload" : "Device"
//                     },
//                     {
//                         "label" : "ประวัติ",
//                         "type" : "text",
//                         "message" : "history",
//                         "payload" : "History"
//                     },
//                     {
//                         "label" : "เปิด/ปิด device",
//                         "type" : "webview",
//                         "url" : "https://web-ble-sample.herokuapp.com/index.html",
//                         "size" : "full",
//                         "sign" : "true",
//                         "onechat_token" : "true"
//                     } 
//                 ]
//             });
    
//             url = 'https://chat-api.one.th/message/api/v1/push_quickreply'
//         }

//         let config = {
//             method: 'post',
//             url: url,
//             headers: { 
//                 'Authorization': 'Bearer Afa48433443b75789b529a8fcef1b4eff295a28438b524eec8ccdb3855a95a311ff240b8d6733489fa86fc17ded6c9719', 
//                 'Content-Type': 'application/json'
//             },
//             data : data
//             };

//         axios(config)
//         .then((response) => console.log("response outside ===>", response.data))
//         .catch((error) => console.log(error));

        

//         res.send("test webhook onechat")
        
//     } catch (err) {
//         console.log(err);
//         req.send({message: err.message, status:'fail', data:''})
//     }
    
// })

app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on 3000 port!`))
